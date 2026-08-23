import { execSync, spawn } from "child_process";

console.log("\n🚀 Medici Accounting Engine Başlatılıyor...\n");

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
    console.warn("⚠️ Docker compose başlatılamadı, MongoMemoryServer moduna geçiliyor.\n");
  }
} else {
  console.log("ℹ️  Docker çalışmıyor. Uygulama otomatik olarak 'mongodb-memory-server' (Sıfır Konfigürasyonlu In-Memory DB) modunda çalışacak.\n");
}

console.log("⚡ Next.js Dev sunucusu başlatılıyor...\n");

const nextProcess = spawn("pnpm", ["exec", "next", "dev"], {
  stdio: "inherit",
  shell: true,
});

nextProcess.on("exit", (code) => {
  process.exit(code || 0);
});
