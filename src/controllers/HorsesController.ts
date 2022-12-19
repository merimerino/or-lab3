import { NextFunction, Request, Response } from "express";
import pool from "../connection";
import api from "../openapi.json";

const openApi = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: api,
  });
};

//GET METHODS
const getAllHorses = (req: Request, res: Response, next: NextFunction) => {
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log("Entered into error");
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database when getting all horses.",
        response: null,
      });
    }
    pool.query(
      "SELECT horse.*, owner.owner_name as owner_name, owner.owner_surname as owner_surname FROM horse JOIN owner ON owner.id_owner = horse.id_owner",
      function (err: any, rows: any) {
        if (err) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "Requested objects were not found. Wrong query.",
            response: null,
          });
        }
        res.send({
          message: "Fetched all horses.",
          statusCode: 200,
          status: "OK",
          data: rows,
        });
      }
    );
    conn.release();
  });
};

const getHorse = (req: Request, res: Response, next: NextFunction) => {
  var id = req.params["id"];
  console.log(id);
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while getting specific horse.",
        response: null,
      });
    }
    pool.query(
      `SELECT horse.*, owner.owner_name as owner_name, owner.owner_surname as owner_surname FROM horse JOIN owner ON owner.id_owner = horse.id_owner WHERE horse.id_horse = ${id}`,

      function (err: any, rows: any) {
        console.log(rows);
        if (err || rows.rows.length < 1) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "Requested object was not found. Wrong query.",
            response: null,
          });
        }
        res.send({
          message: `Fetched horse with id: ${id}`,
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

const deleteHorse = (req: Request, res: Response, next: NextFunction) => {
  var id = req.params["id"];
  //console.log(req);
  pool.connect(function (err: any, conn: any) {
    if (err) {
      console.log("Entered into error");
      console.log(err);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message:
          "Getting error during the connection to database while trying to delete a horse.",
        response: null,
      });
    }
    let rows = JSON.parse(
      JSON.stringify(pool.query("select id_horse from horse"))
    );
    var ids = [];
    for (let i = 0; i < rows.length; i++) {
      ids.push(rows[i].id_owner);
    }
    if (!ids.includes(id)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Horse not found.",
        response: null,
      });
    }
    pool.query(
      `DELETE FROM public.horse WHERE id_horse = ${id}`,
      function (err: any, rows: any) {
        if (err) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message:
              "Getting error during the connection to database while trying to delete a horse.",
            response: null,
          });
        }
        res.send({
          message: `Deleted horse with id: ${id}`,
          statusCode: 200,
          status: "OK",
          data: null,
        });
      }
    );
    conn.release();
  });
};

export default {
  openApi,
  getAllHorses,
  getHorse,
  deleteHorse,
};
