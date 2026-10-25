import stripe from "../../config/stripe.js";
import Product from "../models/Products.js";
import * as Yup from "yup";

class PaymentController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .of(
          Yup.object({
            id: Yup.number().integer().positive().required(),
            quantity: Yup.number().integer().positive().required(),
          }),
        )
        .required()
        .min(1),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
        strict: true,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.errors,
      });
    }

    const { products } = request.body;

    const productIds = products.map((product) => product.id);

    const uniqueIds = new Set(productIds);

    if (uniqueIds.size !== productIds.length) {
      return response.status(400).json({
        error: "Duplicate product IDs",
      });
    }

    try {
      const foundProducts = await Product.findAll({
        where: {
          id: productIds,
        },
      });

      if (foundProducts.length !== productIds.length) {
        return response.status(400).json({
          error: "One or more products were not found",
        });
      }

      const invalidPrice = foundProducts.some((product) => {
        return product.price <= 0 || !Number.isInteger(product.price);
      });

      if (invalidPrice) {
        return response.status(400).json({
          error: "Invalid product price",
        });
      }

      const lineItems = foundProducts.map((product) => {
        const cartProduct = products.find((item) => {
          return item.id === product.id;
        });

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price,
          },
          quantity: cartProduct.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: "http://localhost:5173/pagamento/sucesso",
        cancel_url: "http://localhost:5173/carrinho",
      });

      return response.status(501).json({
        error: "Payment session not implemented yet",
      });
    } catch (error) {
      console.error("Payment preparation error:", error.message);

      return response.status(500).json({
        error: "Unable to prepare payment",
      });
    }
  }
}

export default new PaymentController();
