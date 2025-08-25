function loadingBar(duration, message = "Loading") {
  const total = 10; // length of the bar
  let progress = 0;

  const interval = setInterval(() => {
    progress++;
    const percent = Math.floor((progress / total) * 100);
    const bar = "█".repeat(progress) + "-".repeat(total - progress);

    process.stdout.write(`\r${message} [${bar}] ${percent}%`);

    if (progress >= total) {
      clearInterval(interval);
      console.log("\nConnecting to server!");
    }
  }, duration / total);
}

module.exports = loadingBar