$(document).ready(function () {
    console.log("announcementAdmin.js is loaded!");

    // Open popup
    $(".new-ann").click(function () {
        console.log("New Announcement button clicked");
        $(".popup-overlay, .popup-form").fadeIn();
    });

    // Close popup
    $(".cancel, .popup-overlay").click(function () {
        console.log("Popup closed");
        $(".popup-overlay, .popup-form").fadeOut();
    });

    // Save button click event
    $("#save-ann").off("click").on("click", function () {
        console.log("Save button clicked");

        let title = $("#ann-title").val().trim();
        let category = $("#ann-category").val().trim();
        let poster = $("#ann-poster").val().trim();
        let body = $("#ann-body").val().trim();
        let currentDate = new Date().toLocaleDateString();

        if (title && category && poster && body) {
            let newAnn = `
                <div class="ann-card">
                    <div class="ann-title">${title}</div>
                    <div class="ann-category">${category}</div>
                    <div class="ann-poster">${poster}</div>
                    <div class="ann-date">${currentDate}</div>
                    <div class="ann-body">${body}</div>
                </div>
            `;
            $(".previous.announcements").prepend(newAnn);
            $(".popup-overlay, .popup-form").fadeOut();
            $("#ann-title, #ann-category, #ann-poster, #ann-body").val("");
        } else {
            alert("Please fill in all fields.");
        }
    });
});
