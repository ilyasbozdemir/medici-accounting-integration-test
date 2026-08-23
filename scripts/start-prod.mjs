import { execSync, spawn } from "child_process";

console.log("\n🏢 Medici Muhasebe Motoru - Prodüksiyon Başlatılıyor...\n");

// Check Docker status
let isDockerRunning = false;
try {
  execSync("docker ps", { stdio: "ignore" });
  isDockerRunning = true;
} catch (e) {
  isDockerRunning = false;
}

if (isDockerRunning) {
  console.log("🐳 Docker Desktop algılandı! MongoDB container başlatılıyor (docker compose up -d)...");
  try {
    execSync("docker compose up -d", { stdio: "inherit" });
    console.log("✅ MongoDB container başarıyla çalışıyor (port 27017).\n");
  } catch (err) {
    console.warn("⚠️ Docker compose başlatılamadı, harici MONGODB_URI veya In-Memory DB moduna geçilecek.\n");
  }
} else {
  console.log("ℹ️  Docker çalışmıyor. Harici MONGODB_URI veya In-Memory MongoDB Server modunda devam edilecek.\n");
}

console.log("🚀 Next.js Prodüksiyon Sunucusu Başlatılıyor (next start)...\n");

const nextProcess = spawn("pnpm", ["exec", "next", "start"], {
  stdio: "inherit",
  shell: true,
});

nextProcess.on("exit", (code) => {
  process.exit(code || 0);
});
