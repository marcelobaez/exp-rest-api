const oracledb = require("oracledb");

// const sql = `select e1.ID,e1.TIPO_OPERACION, e1.ORD_HIST,e1.id_expediente, e1.expediente,e1.fecha_operacion,e1.usuario,e1.usuario_destino,e1.destinatario,e1.id_expediente_electronico, e1.estado, e1.reparticion_destino, e1.reparticion_usuario, e1.codigo_sector_destino, e1.descripcion_reparticion_destin, e1.descripcion_reparticion_origen, e1.descripcion_sector_destino, e1.descripcion_sector_origen, e1.ID_EXPEDIENTE,e1.codigo_reparticion_destino,e1.motivo FROM EE_GED.historialoperacion e1
// inner join (select id_expediente, MAX(ORD_HIST) ORD_HIST  from EE_GED.historialoperacion group by id_expediente) e2
// on e1.id_expediente=e2.id_expediente and e1.ord_hist = e2.ord_hist where e1.fecha_operacion > TO_DATE('18/12/2020', 'DD/MM/YYYY') ORDER BY e1.fecha_operacion DESC`

const getExpById = async (req, res) => {
  let connection;

  try {
    const connection = await oracledb.getConnection({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    const anio = 2018;
    const numero = 317;

    const sql = `SELECT id, descripcion
    FROM EE_GED.EE_EXPEDIENTE_ELECTRONICO
    WHERE ANIO = :anio
    AND NUMERO = :numero`;

    const result = await connection.execute(sql, [anio, numero], {
      maxRows: 1,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    result.rows ? res.send(result) : res.send("No results");
    await connection.close();
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

const getPases = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    const sqlPases = `select e1.ID,e1.TIPO_OPERACION, e1.ORD_HIST,e1.id_expediente, e1.expediente,e1.fecha_operacion,e1.usuario,e1.usuario_destino,e1.destinatario,e1.id_expediente_electronico, e1.estado, e1.reparticion_destino, e1.reparticion_usuario, e1.codigo_sector_destino, e1.descripcion_reparticion_destin, e1.descripcion_reparticion_origen, e1.descripcion_sector_destino, e1.descripcion_sector_origen, e1.ID_EXPEDIENTE,e1.codigo_reparticion_destino,e1.motivo FROM EE_GED.historialoperacion e1
    inner join (select id_expediente, MAX(ORD_HIST) ORD_HIST  from EE_GED.historialoperacion group by id_expediente) e2
    on e1.id_expediente=e2.id_expediente and e1.ord_hist = e2.ord_hist where e1.fecha_operacion > TO_DATE('18/12/2020', 'DD/MM/YYYY') ORDER BY e1.fecha_operacion DESC`;

    const sqlCountExp = `select count(*) as total from ee_ged.ee_expediente_electronico`;

    const sqlCountDocs = `select count(*) as total from gedo_ged.gedo_documento a

join gedo_ged.gedo_tipodocumento b on b.id = a.tipo

where acronimo not in ('PV', 'CAREX', 'AEIPC', 'AEPPA', 'TESTI', 'TESTF', 'TESTL')`;

    const sqlUsers = `select aceptacion_tyc, count(*) AS total from sade_sector_usuario a

    join sade_sector_interno b on b.id_sector_interno = a.ID_SECTOR_INTERNO
  
    join sade_reparticion c on c.id_reparticion = b.codigo_reparticion
  
    join co_ged.datos_usuario du on du.usuario = a.nombre_usuario
  
    where a.estado_registro = 1
  
    group by aceptacion_tyc`;

    const pases = await connection.execute(sqlPases, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const countExp = await connection.execute(sqlCountExp, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const countDocs = await connection.execute(sqlCountDocs, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const countUsers = await connection.execute(sqlUsers, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ pases, countExp, countDocs, countUsers });
    await connection.close();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const countExp = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    const sql = `select count(*) as total from ee_ged.ee_expediente_electronico`;

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    result.rows ? res.send(result) : res.send("No results");
    await connection.close();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const countDocs = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    const sql = `select count(*) as total from gedo_ged.gedo_documento a

join gedo_ged.gedo_tipodocumento b on b.id = a.tipo

where acronimo not in ('PV', 'CAREX', 'AEIPC', 'AEPPA', 'TESTI', 'TESTF', 'TESTL')`;

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    result.rows ? res.send(result) : res.send("No results");
    await connection.close();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getPases, countExp, countDocs, getExpById };
