$(document).ready(function () {
    const $popupOverlay = $(".popup-overlay");
    const $filePopup = $(".popup-form");
    const $addFileBtn = $(".add-file");
    const $cancelPopup = $(".cancel");

    fetchFiles();

    function fetchFiles() {
        $.get("http://localhost:3001/files", function (files) {
            console.log("📂 Received files:", files);
            $(".documents-container").empty();

            files.forEach(file => {
                const card = `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-name">${file.title}</div>
                        </div>
                        <div class="card-date">${file.description}</div>
                        <a href="http://localhost:3001/uploads/${file.filename}" target="_blank">📄 View File</a>
                        <div class="card-delete">Delete</div>
                    </div>
                `;
                $(".documents-container").append(card);
            });
        });
    }

    // Open popup
    $addFileBtn.on("click", function () {
        $popupOverlay.fadeIn();
        $filePopup.fadeIn();
    });

    // Close popup
    $cancelPopup.on("click", function () {
        $popupOverlay.fadeOut();
        $filePopup.fadeOut();
    });

    // Handle file upload
    $("#save-file").on("click", function (event) {
        event.preventDefault();

        let fileInput = $("#file-upload")[0].files[0];
        console.log(fileInput);
        if (!fileInput) {
            alert("❌ Please select a file to upload!");
            return;
        }

        let formData = new FormData();
        formData.append("file", fileInput);
        formData.append("name", $("#file-name").val());
        formData.append("category", $("#file-category").val());
        formData.append("description", $("#file-description").val());

        $.ajax({
            url: "http://localhost:3001/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert(response.message);
                $popupOverlay.fadeOut();
                $filePopup.fadeOut();
                fetchFiles(); // ✅ Refresh the list AFTER upload
            },
            error: function (xhr) {
                alert("❌ Error uploading file: " + (xhr.responseJSON?.message || "Unknown error"));
            }
        });
    });
});
