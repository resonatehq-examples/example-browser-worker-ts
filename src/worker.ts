import { Resonate, Context } from "@resonatehq/sdk";

declare const document: any;

function addExecutionStep(functionCall: string, status: string = "executing") {
  const logBody = document.getElementById("execution-log");
  if (logBody) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="tag is-info">${status}</span></td>
      <td><code>${functionCall}</code></td>
    `;
    logBody.appendChild(row);
  }
}

function* factorial(ctx: Context, i: number): Generator<any, number, any> {
  addExecutionStep(`factorial(${i})`, "micro restart");
  console.log(`factorial(${i}) micro restart`);
  if (i == 0) {
    return 1;
  } else {
    //return i * (yield* ctx.run(factorial, i - 1));
    return i * (yield* ctx.rpc("factorial", i - 1));
  }
}

async function main() {
  const resonate = new Resonate({});
  resonate.register("factorial", factorial);
}

main().catch((error) => {
  console.error("Uncaught error in main():", error);
  addExecutionStep("main()", "error");
});
