$(document).ready(function () {
    console.log("✅ announcementAdmin.js loaded!");

    // Fetch Announcements from MongoDB Atlas
    function fetchAnnouncements() {
        $.get("/api/announcements", function (announcements) {
            $(".previous.announcements").empty();

            announcements.forEach(ann => {
                let annHTML = `
                    <div class="ann-card">
                        <div class="ann-title">${ann.title}</div>
                        <div class="ann-category">${ann.category}</div>
                        <div class="ann-poster">${ann.uploader}</div>
                        <div class="ann-date">${new Date(ann.dateTime).toLocaleString()}</div>
                        <div class="ann-body">${ann.body}</div>
                    </div>
                `;
                $(".previous.announcements").append(annHTML);
            });
        }).fail(function () {
            console.error("❌ Error fetching announcements.");
        });
    }

    // Load Announcements on Page Load
    fetchAnnouncements();

    // Open Popup
    $(".new-ann").click(function () {
        $(".popup-overlay, .popup-form").fadeIn();
    });

    // Close Popup
    $(".cancel, .popup-overlay").click(function () {
        $(".popup-overlay, .popup-form").fadeOut();
    });

    // Save New Announcement
    $("#save-ann").off("click").on("click", function () {
        let title = $("#ann-title").val().trim();
        let category = $("#ann-category").val().trim();
        let uploader = $("#ann-poster").val().trim(); 
        let body = $("#ann-body").val().trim();

        if (title && category && uploader && body) {
            let newAnn = { title, category, uploader, body };

            
            $.ajax({
                url: "/api/announcements",    
                type: "POST",                 
                contentType: "application/json", 
                data: JSON.stringify(newAnn),   
                success: function (response) {
                    console.log("✅ Announcement saved:", response);
                    fetchAnnouncements(); // Refresh List
                    $(".popup-overlay, .popup-form").fadeOut();
                    $("#ann-title, #ann-category, #ann-poster, #ann-body").val(""); 
                },
                error: function () {
                    alert("❌ Error saving announcement.");
                }
            });
        } else {
            alert("⚠️ Please fill in all fields.");
        }
    });
});
