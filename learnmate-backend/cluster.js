const cluster = require('cluster');
const os = require('os');
const app = require('./app');

// Determine number of CPUs to use
// For this environment, we'll cap at 8 to avoid overwhelming minimal VMs, or use all if less.
// In production, use os.cpus().length
const numCPUs = process.env.WEB_CONCURRENCY || os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    const PORT = process.env.PORT || 5000;

    // Note: app.listen inside app.js is skipped because of require.main check
    // So we start it here explicitly for the worker
    // So we start it here explicitly for the worker
    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });

    // Initialize Socket.io
    const socketService = require('./services/socketService');
    const io = socketService.init(server);

    // Apply Auth Middleware
    io.use(require('./middleware/socketAuth'));
}
