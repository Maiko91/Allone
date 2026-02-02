Write-Host "🚀 Iniciando reconstrucción de la base de datos AllOne..." -ForegroundColor Cyan

# 1. Navegar al directorio del servidor si no estamos ahí
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 2. Sincronizar esquema (Crea tablas)
Write-Host "📦 Generando tablas desde schema.prisma..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

# 3. Generar cliente Prisma
Write-Host "⚙️ Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# 4. Ejecutar Seed (Poblar datos iniciales)
Write-Host "🌱 Poblando datos iniciales..." -ForegroundColor Yellow
npx prisma db seed

Write-Host "✅ Base de datos reconstruida y lista para usar." -ForegroundColor Green
