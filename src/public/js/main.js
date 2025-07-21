let updateInterval;
let uptimeSeconds = 0;

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${secs}s`;

  return result;
}

function updateUptime() {
  uptimeSeconds++;
  const uptimeElement = document.getElementById("uptime-display");
  if (uptimeElement) {
    uptimeElement.textContent = formatUptime(uptimeSeconds);
  }
}

async function updateSystemData() {
  try {
    const response = await fetch("/api/system");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const cpuLoad = parseFloat(data.cpu?.load) || 0;
    const cpuLoadElement = document.getElementById("cpu-load");
    const cpuProgressElement = document.getElementById("cpu-progress");
    if (cpuLoadElement) cpuLoadElement.textContent = cpuLoad + "%";
    if (cpuProgressElement) cpuProgressElement.style.width = cpuLoad + "%";

    const ramUsageElement = document.getElementById("ram-usage");
    const ramPercentElement = document.getElementById("ram-percent");
    const ramProgressElement = document.getElementById("ram-progress");

    if (ramUsageElement) {
      ramUsageElement.textContent = `${data.ram?.used || "N/A"} / ${
        data.ram?.total || "N/A"
      } GB`;
    }
    if (ramPercentElement) {
      ramPercentElement.textContent = (data.ram?.percent || "0") + "%";
    }
    if (ramProgressElement) {
      const ramPercent = parseFloat(data.ram?.percent) || 0;
      ramProgressElement.style.width = ramPercent + "%";
    }

    const diskUsageElement = document.getElementById("disk-usage");
    const diskPercentElement = document.getElementById("disk-percent");
    const diskProgressElement = document.getElementById("disk-progress");

    if (diskUsageElement) {
      diskUsageElement.textContent = `${data.disk?.used || "N/A"} / ${
        data.disk?.total || "N/A"
      } GB`;
    }
    if (diskPercentElement) {
      diskPercentElement.textContent = (data.disk?.percent || "0") + "%";
    }
    if (diskProgressElement) {
      const diskPercent = parseFloat(data.disk?.percent) || 0;
      diskProgressElement.style.width = diskPercent + "%";
    }

    const batteryPercent = data.battery?.percent;
    const batteryPercentElement = document.getElementById("battery-percent");
    const batteryProgressElement = document.getElementById("battery-progress");

    if (batteryPercentElement) {
      if (batteryPercent !== "N/A" && !isNaN(batteryPercent)) {
        batteryPercentElement.textContent = batteryPercent + "%";
        if (batteryProgressElement) {
          batteryProgressElement.style.width = batteryPercent + "%";
        }
      } else {
        batteryPercentElement.textContent = "N/A";
      }
    }

    const batteryStatusElement = document.getElementById("battery-status");
    if (batteryStatusElement) {
      if (data.battery?.isCharging === true) {
        batteryStatusElement.innerHTML = '<i class="fas fa-plug"></i> Charging';
      } else if (data.battery?.isCharging === false) {
        batteryStatusElement.innerHTML =
          '<i class="fas fa-battery-three-quarters"></i> Not Charging';
      } else {
        batteryStatusElement.textContent = "N/A";
      }
    }

    const networkRxElement = document.getElementById("network-rx");
    const networkTxElement = document.getElementById("network-tx");

    if (networkRxElement)
      networkRxElement.textContent = data.network?.rx || "0";
    if (networkTxElement)
      networkTxElement.textContent = data.network?.tx || "0";

    const osInfoElement = document.getElementById("os-info");
    if (osInfoElement) osInfoElement.textContent = data.os || "Unknown";

    if (data.uptime && !isNaN(data.uptime)) {
      uptimeSeconds = parseInt(data.uptime);
    }

    const statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.className = "status live";
      statusElement.innerHTML = '<i class="fas fa-circle"></i> Live Monitoring';
    }
  } catch (error) {
    console.error("Error updating system data:", error);
    const statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.className = "status error";
      statusElement.innerHTML =
        '<i class="fas fa-exclamation-triangle"></i> Connection Error';
    }
  }
}

function startLiveUpdates() {
  updateSystemData();
  updateInterval = setInterval(updateSystemData, 1000);

  setInterval(updateUptime, 1000);
}

async function initializeUptime() {
  try {
    const response = await fetch("/api/system");
    const data = await response.json();
    if (data.uptime && !isNaN(data.uptime)) {
      uptimeSeconds = parseInt(data.uptime);
    }

    const uptimeElement = document.getElementById("uptime-display");
    if (uptimeElement) {
      uptimeElement.textContent = formatUptime(uptimeSeconds);
    }
  } catch (error) {
    console.error("Error initializing uptime:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeUptime();

  setTimeout(startLiveUpdates, 1000);
});

window.addEventListener("beforeunload", () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
