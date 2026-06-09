const getBaseUrl = () => {
  return localStorage.getItem("mediguide_api_url") || "http://localhost:8000/api";
};

export const apiService = {
  /**
   * Send symptoms or follow-up query to the chat assistant.
   * @param {string} message 
   * @param {Array<{role: string, content: string}>} history 
   */
  async chat(message, history = []) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history: history.map(h => ({
          role: h.role === "assistant" || h.role === "model" ? "model" : "user",
          content: h.content
        }))
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "API Error" }));
      throw new Error(err.detail || "Server communication failed.");
    }
    return response.json();
  },

  /**
   * Upload a PDF or TXT medical report to get an AI-generated summary.
   * @param {File} file 
   */
  async uploadReport(file) {
    const baseUrl = getBaseUrl();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "Medical report upload failed.");
    }
    return response.json();
  },

  /**
   * Evaluate patient symptoms to classify triage severity.
   * @param {string} symptoms 
   */
  async triage(symptoms) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/emergency`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Triage failed" }));
      throw new Error(err.detail || "Emergency assessment failed.");
    }
    return response.json();
  }
};
