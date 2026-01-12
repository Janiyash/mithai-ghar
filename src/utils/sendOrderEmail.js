import emailjs from "emailjs-com";

export const sendOrderEmail = async (order) => {
  const templateParams = {
    user_name: order.name,
    phone: order.phone,
    email: order.email,
    address: order.address,
    delivery_time: order.deliveryTime,
    items: order.items
      .map(i => `${i.name} x${i.quantity}`)
      .join("\n"),
    total: order.total,
    date: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  return emailjs.send(
    "service_0uwm4no",
    "template_smjnibr",
    templateParams,
    "k2xUBiZ_NwUwzlYrj"
  );
};
