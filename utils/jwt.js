import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    
  }
};

const verifyToken = (req, res, next) => {
  try {
    // const authHeader = req.headers["Authorization"];
    const token = req.headers["authorization"];
    
    // const token = authHeader && authHeader.split(" ")[1];

    if (!token ) return res.json({status:'failed'});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {
     
  }
};

const jwtAdmin = async (req, res, next) => {
  try {
    const token = req.headers["a-access-token"];
   
    if (!token) {
      res.send({ status: "failed", message: "You need token" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({
            auth: false,
            status: "failed",
            message: "failed to authenticate",
          });
        } else {
          req.adminId = decoded.adminId;
          next();
        }
      });
    }
  } catch (error) {
    next(error);
  }
};



export default { jwtAdmin, verifyToken, generateToken };
