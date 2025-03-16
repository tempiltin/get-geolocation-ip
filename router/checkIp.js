const express = require("express");
const axios = require("axios");
const reuestIp = require("request-ip");
require("dotenv").config();

const router = express.Router();

const VPN_API_KEY = process.env.VPN_API_KEY;

router.get("/check-ip", async (req, res) => {
  try {
    const clientIp =
      req.headers["x-forwarded-for"] || req.getClientIp(req) || "0.0.0.0";
    const cleanIp = clientIp.split(",")[0].trim();

    console.log(` IP manzil tekshirilmoqda ... ! ${cleanIp}`);

    const vpnResponse = await axios.get(
      `${process.env.VPN_API_URL}/api${cleanIp}?key=${VPN_API_KEY}`
    );

    if (!vpnResponse.data || !vpnResponse.data.security) {
      return res
        .status(500)
        .json({ status: 500, msg: "VPN API javobi noto'g'ri" });
    }

    const isVpn =
      vpnResponse.data.security.vpn || vpnResponse.data.security.proxy;
    if (isVpn) {
      return res
        .status(403)
        .json({
          status: 403,
          msg: "VPN dan foydalanilmoqda Iltimos VPN ni o'chiring !",
        });
    }

    res.status(200).json({
      status: 200,
      ip: vpnResponse.data.ip,
      country: vpnResponse.data.location.country,
      city: vpnResponse.data.location.city,
      msg: "IP manzil muvofaiyatli tekshirildi",
    });
  } catch (error) {
    console.error("xatolik aniqlandi" , error.message);
    res.status(500).json({status: 500, msg: "Serverda xatolik yuz berdi"});
  }
});

module.exports = router;