// Phone Number Dropdown
const phoneInput = document.querySelector("#phone");
const phoneError = document.getElementById("phoneError");

const iti = window.intlTelInput(phoneInput, {
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch("https://ipapi.co/json").then(res => res.json()).then(data => callback(data.country_code)).catch(() => callback("us"));
    }
});

// --- Programming Language Multi-Select Logic ---
const dropdownHeader = document.getElementById('dropdownHeader');
const dropdownContent = document.getElementById('langOptions');
const dropdownText = document.getElementById('dropdown-text');
const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');

// Toggle dropdown open/close
dropdownHeader.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevents the click from instantly closing it via the window listener
    dropdownContent.classList.toggle('show');
    dropdownHeader.classList.toggle('active');
});

// Update the header text when boxes are checked
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateDropdownText);
});

function updateDropdownText() {
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);

    if (checkedBoxes.length === 0) {
        dropdownText.textContent = 'Select languages...';
        dropdownText.style.color = 'var(--text-main)';
    } else if (checkedBoxes.length <= 2) {
        // If 1 or 2 selected, show their names (e.g., "HTML/CSS, React")
        const names = checkedBoxes.map(cb => cb.value).join(', ');
        dropdownText.textContent = names;
        dropdownText.style.color = 'var(--primary-color)';
    } else {
        // If 3 or more, just show the count to keep it clean
        dropdownText.textContent = `${checkedBoxes.length} languages selected`;
        dropdownText.style.color = 'var(--primary-color)';
    }
}

// Close the dropdown if the user clicks anywhere else on the page
window.addEventListener('click', function (e) {
    if (!dropdownHeader.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.classList.remove('show');
        dropdownHeader.classList.remove('active');
    }
});

// CV Upload visual feedback
// CV Upload logic (Click AND Drag & Drop)
const cvUpload = document.getElementById('cv-upload');
const uploadText = document.getElementById('upload-text');
const uploadBox = document.querySelector('.upload-box'); // Select the drag area

// 1. Handle standard click-to-upload
cvUpload.addEventListener('change', function (e) {
    handleFiles(this.files);
});

// 2. Prevent default browser drag-and-drop behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 3. Add visual feedback when dragging a file over the box
['dragenter', 'dragover'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
        uploadBox.style.borderColor = "var(--primary-color)";
        uploadBox.style.backgroundColor = "rgba(166, 106, 56, 0.05)"; // Slight tint
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
        uploadBox.style.borderColor = ""; // Reset border
        uploadBox.style.backgroundColor = ""; // Reset background
    }, false);
});

// 4. Handle the actual drop
uploadBox.addEventListener('drop', function (e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    // Assign the dropped file to the hidden input
    cvUpload.files = files;

    // Process the visual feedback
    handleFiles(files);
}, false);

// 5. Helper function to update the text and validate the file type
function handleFiles(files) {
    if (files && files.length > 0) {
        const file = files[0];
        const fileName = file.name.toLowerCase();

        // Check if the file ends with an allowed extension
        if (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
            // Valid file attached
            uploadText.textContent = "Selected: " + file.name;
            uploadText.style.color = "var(--primary-color)";
        } else {
            // Invalid file format
            uploadText.textContent = "Format invalid and not attached. Only .pdf, .doc, or .docx allowed.";
            uploadText.style.color = "#d30000"; // Red text to indicate an error
            cvUpload.value = ""; // Instantly clear the invalid file from the hidden input
        }
    } else {
        // Reset state if no files are dragged
        uploadText.textContent = "Click to Upload or Drag & Drop";
        uploadText.style.color = "var(--text-main)";
    }
}

// CAPTCHA Logic
const canvas = document.getElementById('captchaCanvas');
const ctx = canvas.getContext('2d');
let captchaCode = '';

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    captchaCode = '';
    for (let i = 0; i < 6; i++) {
        captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    ctx.fillStyle = '#fcf9f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(166, 106, 56, ${Math.random() + 0.2})`;
        ctx.lineWidth = Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    ctx.font = '800 28px Outfit, sans-serif';
    ctx.fillStyle = '#1c1815';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < captchaCode.length; i++) {
        ctx.save();
        ctx.translate(30 * i + 25, 30);
        const rot = (Math.random() - 0.5) * 0.5;
        ctx.rotate(rot);
        ctx.fillText(captchaCode[i], 0, 0);
        ctx.restore();
    }
}

generateCaptcha();
document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);

const form = document.getElementById('applicationForm');
const successMsg = document.getElementById('successMessage');

cvUpload.removeAttribute('required');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!iti.isValidNumber()) {
        // Show error message and red border
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = '#d30000';

        // Scroll user back up to the phone input
        phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove the error styling as soon as they start typing again
        phoneInput.addEventListener('input', () => {
            phoneError.style.display = 'none';
            phoneInput.style.borderColor = '';
        }, { once: true });

        return; // Stop the form from submitting
    }

    if (cvUpload.files.length === 0) {
        // 1. Update the text inside the upload box to show the error
        uploadText.textContent = "Required: Please attach a valid CV (.pdf, .doc, .docx)";
        uploadText.style.color = "#d30000"; // Red text

        // 2. Flash the border red
        uploadBox.style.borderColor = "#d30000";
        setTimeout(() => {
            uploadBox.style.borderColor = ""; // Reset border after 2.5s
        }, 2500);

        // 3. Smoothly scroll the user's screen to the upload box
        uploadBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        return; // Stop the submission process entirely
    }

    const input = document.getElementById('captchaInput').value;
    const errorMsg = document.getElementById('captchaError');

    if (input !== captchaCode) {
        errorMsg.style.display = 'block';
        generateCaptcha();
        document.getElementById('captchaInput').value = '';
    } else {
        errorMsg.style.display = 'none';

        // Fade out form
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'flex';

            // Trigger reflow to ensure the transition plays
            void successMsg.offsetWidth;

            // Fade in success message
            successMsg.style.opacity = '1';
            successMsg.style.transform = 'translateY(0)';
        }, 500); // Wait for form to finish fading out
    }
});