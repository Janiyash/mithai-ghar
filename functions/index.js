const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

// 🔔 Trigger when new order is created
exports.sendNewOrderEmail = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();

    const itemsList = order.items
      ?.map(i => `${i.name} × ${i.quantity}`)
      .join("<br>") || "—";

    const mailOptions = {
      from: `"Mithai Ghar" <${functions.config().gmail.email}>`,
      to: functions.config().gmail.email,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order Placed</h2>
        <p><strong>Name:</strong> ${order.delivery?.name}</p>
        <p><strong>Phone:</strong> ${order.delivery?.phone}</p>
        <p><strong>Address:</strong> ${order.delivery?.address}</p>
        <p><strong>Delivery Time:</strong> ${order.delivery?.time}</p>

        <h3>Items</h3>
        <p>${itemsList}</p>

        <h3>Total: ₹${order.total}</h3>
        <p>Status: ${order.status}</p>

        <hr />
        <p>Mithai Ghar Admin Panel</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Admin email sent");
    } catch (error) {
      console.error("❌ Email error:", error);
    }
  });
