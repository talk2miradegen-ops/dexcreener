module.exports = async function handler(req, res) {
  const { ca } = req.query;
  const fs = require('fs');
  const path = require('path');
  
  try {
    const indexPath = path.join(process.cwd(), 'index.html');
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the default image with the dynamic API image route
    const oldImage = "/images/photo_2026-04-23_21-55-06.jpg";
    const oldImageAbsolute = "https://dexscreeners-activelisting.com/images/photo_2026-04-23_21-55-06.jpg";
    const newImage = `https://dexscreener-two.vercel.app/api/og-image/${ca}.png`;
    content = content.replaceAll(oldImageAbsolute, newImage).replaceAll(oldImage, newImage);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(content);
  } catch (error) {
    console.error("Error serving vote page:", error);
    res.status(500).send("Internal Server Error");
  }
};
