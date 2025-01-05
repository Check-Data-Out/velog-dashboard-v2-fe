// @ts-nocheck
module.exports = {
  apps: [
    {
      name: 'velog-dashboard-v2-fe',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/next-err.log',
      out_file: 'logs/next-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 4000,
    },
  ],
};
