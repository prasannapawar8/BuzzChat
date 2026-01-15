/**
 * Download a file from a URL
 * @param {string} fileUrl - The URL of the file to download
 * @param {string} filename - Optional filename for the download
 */
export const downloadFile = (fileUrl, filename) => {
  try {
    if (!fileUrl) {
      throw new Error("No file URL provided");
    }

    console.log("📥 Downloading file:", fileUrl);

    // Add attachment=true parameter to force download instead of preview
    // This works with Cloudinary URLs
    let downloadUrl = fileUrl;
    if (fileUrl.includes("cloudinary.com")) {
      downloadUrl = fileUrl.includes("?")
        ? fileUrl + "&attachment=true"
        : fileUrl + "?attachment=true";
    }

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = downloadUrl;
    
    // Extract filename from URL if not provided
    if (!filename) {
      const urlParts = fileUrl.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      filename = lastPart.split("?")[0] || "download";
    }
    
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    console.log("✅ Download triggered for:", filename);
  } catch (error) {
    console.error("❌ Download failed:", error);
    // Fallback: just open the URL
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  }
};
