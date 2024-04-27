document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");
    let user = JSON.parse(localStorage.getItem("user"));

    function render() {
        const hash = window.location.hash.substr(1); // Get hash excluding the "#"
        switch (hash) {
            case 'signup':
                root.innerHTML = SignUp();
                break;
            case 'profile':
                root.innerHTML = user ? Profile(user) : SignUp(); // Redirect to SignUp if user not logged in
                break;
            default:
                root.innerHTML = SignUp(); // Default to SignUp page
                break;
        }
    }

    function SignUp() {
        return `
            <div class="header-container">
                <h4 class="header">Header</h4>
                <div class="button-container">
                    <button id="signup-btn" class="top-right-btn">Signup</button>
                    <button id="profile-btn" class="top-right-btn">Profile</button>
                </div>
            </div>
            <hr class="spacer">
            <div id ="section">
            <h2>Sign Up</h2>
            <form id="signup-form">
                <!-- Your sign-up form HTML here -->
                <div class="form-group">
                    <label for="fullName"></label> 
                    <input type="text" id="fullName" name="fullName" placeholder="Full Name" onfocus="this.placeholder=''" onblur="this.placeholder='Full Name'">
                </div> <hr>
                <div class="form-group">
                    <label for="email"></label>
                    <input type="email" id="email" name="email" placeholder="Email" onfocus="this.placeholder=''" onblur="this.placeholder='Email'">
                </div> <hr> 
                <div class="form-group">
                    <label for="password"></label>
                    <input type="password" id="password" name="password" placeholder="Password" onfocus="this.placeholder=''" onblur="this.placeholder='Password'">
                </div> <hr>
                <div class="form-group">
                    <label for="confirmPassword"></label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onfocus="this.placeholder=''" onblur="this.placeholder='Confirm Password'">
                </div> <hr>
                <button type="submit">Sign Up</button>
                <div id="message"></div> 
            </form>
            </div>
        `;
    }

    function Profile(user) {
        return `
            <div class="header-container">
                <h4 class="header">Header</h4>
                <div class="button-container">
                    <button id="signup-btn" class="top-right-btn">Signup</button>
                    <button id="profile-btn" class="top-right-btn">Profile</button>
                </div>
            </div>

            <hr class="spacer">

            <div id="profile">
            <h2>Profile</h2>
            <p>Full Name: ${user.fullName}!</p>
            <p>Email: ${user.email}</p>
            <p>Password: ${user.password}</p>
    
            <button id="logout-btn">Logout</button>
            </div>
        `;
    }

    function handleLogout() {
        localStorage.removeItem("user");
        user = null;
        window.location.hash = ''; 
        render();
    }

    function handleSignUp(formData) {

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            showMessage("Error : All fields are mandatory", "error");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showMessage("Passwords do not match", "error");
            return;
        }

        localStorage.setItem("user", JSON.stringify(formData));
        user = formData;
        showMessage("Successfully signed up!", "success");
        setTimeout(function() {
            window.location.hash = 'profile'; 
            render();
        }, 500); 
    }

    function showMessage(message, type) {
        const messageElement = document.getElementById("message");
        messageElement.textContent = message;
        messageElement.className = "message " + type;
    }

    root.addEventListener("submit", function (event) {
        event.preventDefault();
        if (event.target.id === "signup-form") {
            const formData = {
                fullName: event.target.fullName.value,
                email: event.target.email.value,
                password: event.target.password.value,
                confirmPassword: event.target.confirmPassword.value
            };
            handleSignUp(formData);
        }
    });

    root.addEventListener("click", function (event) {
        if (event.target.id === "logout-btn") {
            handleLogout();
        }
    });
  
    window.addEventListener("beforeunload", function(event) { 
        localStorage.setItem("currentState", JSON.stringify({ user }));  
        localStorage.removeItem("user");
    });
 
    const savedState = JSON.parse(localStorage.getItem("currentState"));
    if (savedState && savedState.user) {
        user = savedState.user;
    }

    window.addEventListener('hashchange', render);
    render();
});
