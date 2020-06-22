import { createApp } from "https://servestjs.org/@v1.1.0/mod.ts";
import util from "https://taisukef.github.io/denolib/util.mjs";

// import { config } from "https://deno.land/x/dotenv/mod.ts";
const getSecret = () => {
  return Deno.readTextFileSync(".env").match(/SECRET=(.+)\n/)[1];
};

const FN_CSV = "data/userdata.csv";

const SECRET = getSecret();

const app = createApp();

const form2json = (formdata) => {
  const json = {};
  json.dt = new Date().getTime();
  // console.log(formdata);
  for (const c of formdata) {
    const name = c[0];
    const val = c[1];
    if (typeof val === "object") {
      const fn = val.tempfile.substring(val.tempfile.lastIndexOf("/") + 1);
      Deno.rename(val.tempfile, "data/wav/" + fn);
      json[name] = fn;
    } else {
      json[name] = val;
    }
  }
  // console.log(json);
  return json;
};

try { Deno.mkdirSync("data"); } catch (e) {};
try { Deno.mkdirSync("data/wav"); } catch (e) {};

const appendCSV = (fn, json) => {
  let list = [];
  try {
    list = util.csv2json(util.decodeCSV(util.removeBOM(Deno.readTextFileSync(fn))));
  } catch (e) {
  }
  json.id = list.length + 1;
  list.push(json);
  Deno.writeTextFileSync(fn, util.addBOM(util.encodeCSV(util.json2csv(list))));
};

app.post("/", async (req) => {
  // console.log(req);
  const formdata = await req.formData();
  const json = form2json(formdata);
  appendCSV(FN_CSV, json);
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
    body: JSON.stringify({ res: "ok" }),
  });
});

app.get(new RegExp(`/${SECRET}/*`), async (req) => {
  const fn = req.url.substring(req.url.lastIndexOf("/") + 1);
  if (fn.endsWith(".wav")) {
    const bin = Deno.readFileSync("data/wav/" + fn);
    await req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "audio/wav",
        "Access-Control-Allow-Origin": "*",
      }),
      body: bin,
    });
    return;
  }
  const scsv = Deno.readTextFileSync(FN_CSV);
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/csv",
      "Access-Control-Allow-Origin": "*",
    }),
    body: scsv,
  });
});

app.listen({ port: 8899 });
