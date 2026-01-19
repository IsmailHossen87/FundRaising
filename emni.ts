// const session = await stripe.checkout.sessions.create({
// mode: "payment",
// payment_method_types: ["card"],
// line_items: [{
// price_data: {
// currency: "usd",
// product_data: { name: productName },
// unit_amount: totalAmount * 100,
// },
// quantity: 1,
// }],

// success_url,
// cancel_url,
// });