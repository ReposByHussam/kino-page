export function setupReviewForm() {
  const form = document.querySelector("#review-form");
  if (!form) return;

  const messageEl = document.querySelector("#review-message");
  const movieId = form.dataset.movieId;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const author = String(formData.get("author") ?? "").trim();
    const ratingRaw = String(formData.get("rating") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    //vaLidation for name and rating
    if (!author || ratingRaw === "") {
      if (messageEl)
        messageEl.textContent = "Var snäll och fyll i namn och betyg";
      return;
    }
    //validation for rating range
    const rating = Number(ratingRaw);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      if (messageEl)
        messageEl.textContent = "Betyget måste vara ett nummer mellan 0 och 5";
      return;
    }
    //stauts message
    if (messageEl) messageEl.textContent = "Skickar…";

    // sending review data to server
    try {
      const response = await fetch(
        `/api/movies/${encodeURIComponent(movieId)}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, rating, comment }),
        },
      );

      const payload = await response.json().catch(() => null);
      //error message
      if (!response.ok) {
        const errorMsg =
          payload?.error ?? "Kunde inte skicka recensionen, försök igen senare";
        if (messageEl) messageEl.textContent = errorMsg;
        return;
      }
      //success message
      if (messageEl) messageEl.textContent = "Tack! Din recension är skickad";
      form.reset();
    } catch (err) {
      console.error(err);
      if (messageEl)
        messageEl.textContent = "Något gick fel, försök igen senare";
    }
  });
}
