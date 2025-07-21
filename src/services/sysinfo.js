const si = require("systeminformation");
const os = require("os");

async function getSystemSnapshot() {
  try {
    const [cpu, mem, disks, battery, networks, osInfo, uptime] =
      await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.battery(),
        si.networkStats(),
        si.osInfo(),
        si.time(),
      ]);

    const platform = os.platform();

    let mainMount;
    if (platform === "win32") {
      mainMount =
        disks.find(
          (d) =>
            d.mount.toUpperCase() === "C:" ||
            d.fs.toUpperCase().startsWith("C:")
        )?.mount || "C:";
    } else {
      mainMount = "/";
    }

    const mainDisk = disks.find((d) => d.mount === mainMount);

    let diskInfo = {
      total: "N/A",
      used: "N/A",
      percent: "N/A",
    };
    if (mainDisk) {
      const used =
        typeof mainDisk.available === "number"
          ? mainDisk.size - mainDisk.available
          : mainDisk.used;
      diskInfo = {
        total: (mainDisk.size / 1024 ** 3).toFixed(1),
        used: (used / 1024 ** 3).toFixed(1),
        percent: ((used / mainDisk.size) * 100).toFixed(1),
      };
    }

    const totalRx = networks.reduce((sum, n) => sum + (n.rx_sec || 0), 0);
    const totalTx = networks.reduce((sum, n) => sum + (n.tx_sec || 0), 0);

    return {
      cpu: { load: cpu.currentLoad.toFixed(1) },
      ram: {
        total: (mem.total / 1024 ** 3).toFixed(1),
        used: (mem.used / 1024 ** 3).toFixed(1),
        percent: ((mem.used / mem.total) * 100).toFixed(1),
      },
      disk: diskInfo,
      battery: {
        percent: battery.hasBattery ? battery.percent : "N/A",
        isCharging: battery.hasBattery ? battery.isCharging : "N/A",
      },
      network: {
        rx: (totalRx / 1024).toFixed(1),
        tx: (totalTx / 1024).toFixed(1),
      },
      os: `${osInfo.distro} ${osInfo.release}`,
      uptime: uptime.uptime,
    };
  } catch (error) {
    console.error("Error getting system snapshot:", error);
    return { error: "Failed to retrieve system information" };
  }
}

module.exports = { getSystemSnapshot };
