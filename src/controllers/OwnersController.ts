import { NextFunction, Request, Response } from "express";
import pool from "../connection";

function generateID() {
  pool.connect();
  let rows = JSON.parse(
    JSON.stringify(pool.query("select id_owner from owner"))
  );
  var ids = [];
  for (let i = 0; i < rows.length; i++) {
    ids.push(rows[i].id_owner);
  }
  var uniqueID = Math.floor(Math.random() * (9999 - 100 + 1) + 100);
  while (ids.includes(uniqueID)) {
    uniqueID = Number(Math.floor(Math.random() * (9999 - 100 + 1) + 100));
  }
  console.log("Unique id ", uniqueID);
  return uniqueID;
}

//GET METHODS

const getAllOwners = (req: Request, res: Response, next: NextFunction) => {
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database when getting all owners.",
        response: null,
      });
    }
    pool.query("SELECT * FROM owner", function (err: any, rows: any) {
      if (err) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Requested object was not found. Wrong query.",
          response: null,
        });
      }
      res.send({
        message: "Fetched all owners.",
        statusCode: 200,
        status: "OK",
        data: rows,
      });
    });
    conn.release();
  });
};
const getOwner = (req: Request, res: Response, next: NextFunction) => {
  var id = req.params["id"];

  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while getting specific owner.",
        response: null,
      });
    }
    pool.query(
      `SELECT * FROM owner WHERE owner.id_owner = ${id}`,
      function (err: any, rows: any) {
        if (err || rows.rows.length < 1) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "Requested object was not found. Wrong query.",
            response: null,
          });
        }
        console.log(rows);
        res.send({
          message: `Fetched owner with id: ${id}`,
          statusCode: 200,
          status: "OK",
          data: rows,
        });
      }
    );
    conn.release();
  });
};

const getOwnersHorses = (req: Request, res: Response, next: NextFunction) => {
  var id = req.params["id"];
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection while getting all horses from selected owner.",
        response: null,
      });
    }
    pool.query(
      `SELECT horse.*, owner.owner_name as owner_name, owner.owner_surname as owner_surname FROM horse JOIN owner ON owner.id_owner = horse.id_owner WHERE horse.id_owner = ${id}`,

      function (err: any, rows: any) {
        if (err || rows.rows.length < 1) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "Requested object was not found. Wrong query.",
            response: null,
          });
        }
        res.send({
          message: `Fetched all horses from owner with id: ${id}`,
          statusCode: 200,
          status: "OK",
          data: rows,
        });
      }
    );
    conn.release();
  });
};

//POST METHOD

const addOwner = (req: Request, res: Response, next: NextFunction) => {
  var body = req.body;
  var generatedID = generateID();
  console.log(generatedID);

  //console.log(req);
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log("Entered into error");
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while trying to add a new owner.",
        response: null,
      });
    }
    pool.query(
      `INSERT INTO owner VALUES(${generatedID}, '${body.owner_name}','${body.owner_surname}')`,
      function (err: any, rows: any) {
        if (err) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message:
              "Wrong body structure. Body should contain owner_name and owner_surname.",
            response: null,
          });
        }
        res.send({
          message: `Added new owner with id: ${generatedID}`,
          statusCode: 200,
          status: "OK",
          data: {
            id_owner: generatedID,
            owner_name: body.owner_name,
            owner_surname: body.owner_surname,
          },
        });
      }
    );
    conn.release();
  });
};

//PUT METHOD

const updateOwner = (req: Request, res: Response, next: NextFunction) => {
  var body = req.body;
  var id = req.params["id"];
  console.log(body.owner_name, body.owner_surname);
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log("Entered into error");
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while trying to update owner.",
        response: null,
      });
    }
    if (err) {
      console.log("Entered into error");
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while trying to update owner.",
        response: null,
      });
    }
    let rows = JSON.parse(
      JSON.stringify(pool.query("select id_owner from owner"))
    );
    var ids = [];
    for (let i = 0; i < rows.length; i++) {
      ids.push(rows[i].id_owner);
    }
    if (!ids.includes(id)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found.",
        response: null,
      });
    }

    pool.query(
      `UPDATE public.owner
      SET id_owner=${id}, owner_name='${body.owner_name}', owner_surname='${body.owner_surname}'
      WHERE id_owner=${id}`,
      function (err: any, rows: any) {
        if (err) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message:
              "Wrong body structure. Body should contain owner_name and owner_surname.",
            response: null,
          });
        }
        res.send({
          message: `Updated owner with id: ${id}`,
          statusCode: 200,
          status: "OK",
          data: {
            id_owner: id,
            owner_name: body.owner_name,
            owner_surname: body.owner_surname,
          },
        });
      }
    );
    conn.release();
  });
};

export default {
  getAllOwners,
  getOwner,
  getOwnersHorses,
  addOwner,
  updateOwner,
};
