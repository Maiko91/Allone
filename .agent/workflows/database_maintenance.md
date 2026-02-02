---
description: Mantener los scripts de base de datos actualizados tras cambios en schema.prisma
---

# Mantenimiento de Base de Datos

Cada vez que se realice una modificación en el archivo `d:/Work/Allone/server/prisma/schema.prisma`, es obligatorio seguir estos pasos para asegurar que la aplicación sea recuperable:

1. **Actualizar el Seed**: Revisar `d:/Work/Allone/server/prisma/seed.ts` para asegurar que los datos iniciales siguen siendo compatibles con el nuevo esquema.
2. **Sincronizar DB**: Ejecutar `npx prisma db push` en la carpeta del servidor.
3. **Regenerar Cliente**: Ejecutar `npx prisma generate` en la carpeta del servidor.
4. **Verificar Scripts**: Asegurar que `rebuild-db.ps1` sigue funcionando correctamente.

Este flujo asegura que el proyecto siempre tenga una forma rápida de reconstruirse desde cero.
