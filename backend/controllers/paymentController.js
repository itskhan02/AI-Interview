import razorpay from "../services/razorpay.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";
import User from "../models/User.js";



export const createOrder = async (req, res) => {
  try {
    const {planId, amount, credits} = req.body;

    if(!amount || !credits){
      return res.status(400).json({ message: "Invalid plan details"});
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`, 
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created"
    });

    return res.json(order);
    
  } catch (error) {
    console.error("Payment order creation failed:", error.message);
    return res.status(500).json({ message: "Failed to create order" });
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

      if(expectedSignature !== razorpay_signature){
        return res.status(400).json({ message: "Invalid payment signature"});
      }


      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

      if(!payment){
        return res.status(404).json({ message: "Payment not found"});
      }

      if(payment.status === "success"){
        return res.status(400).json({ message: "Payment already processed"});
      }

      payment.status = "success";
      payment.razorpayPaymentId = razorpay_payment_id;
      await payment.save();

      const updateUser = await User.findByIdAndUpdate(req.userId, {
        $inc: { credits: payment.credits },
      }, {new: true});

      return res.json({
        success: true,
        message: "Payment successful, credits added to your account",
        user: updateUser
      });

  } catch (error) {
    console.error("Payment verification failed:", error.message);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
}
