document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutForm = document.getElementById('logout-form');
    const selectCourseForm = document.getElementById('select-course-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const email = formData.get('email');
            const full_name = formData.get('full_name');
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, email, full_name })
                });
                if (response.ok) {
                    alert('Registration successful');
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (response.ok) {
                    alert('Login successful');
                    window.location.href = '/dashboard';
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (logoutForm) {
        logoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', {
                    method: 'POST'
                });
                if (response.ok) {
                    alert('Logout successful');
                    window.location.href = '/';
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (selectCourseForm) {
        selectCourseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(selectCourseForm);
            const courseId = formData.get('courseId');
            try {
                const response = await fetch('/select-course', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ courseId })
                });
                if (response.ok) {
                    alert('Course selected successfully');
                } else {
                    alert('Course selection failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Check if the current page is the dashboard page
    if (window.location.pathname === '/dashboard') {
        fetchFullName();
        fetchSelectedCourses();
        fetchAllCourses();
    }
});

function fetchCourseContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    fetch(`/course/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayCourseContent(data);
        })
        .catch(error => {
            console.error('Error fetching course content:', error);
        });
}

function displayCourseContent(courseContent) {
    const courseNameElement = document.getElementById('course-name');
    courseNameElement.textContent = courseContent.name;

    const courseContentElement = document.getElementById('course-content');
    courseContentElement.innerHTML = '';

    courseContent.modules.forEach(module => {
        const moduleSection = document.createElement('section');
        moduleSection.innerHTML = `
            <h2>${module.title}</h2>
            <p>${module.description}</p>
        `;
        courseContentElement.appendChild(moduleSection);
    });
}

function fetchLeaderboardData() {
    fetch('/leaderboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayLeaderboardData(data);
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}

function displayLeaderboardData(leaderboardData) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
        </tr>
    `;

    leaderboardData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        table.appendChild(row);
    });

    leaderboardElement.appendChild(table);
}

function fetchFullName() {
    fetch('/get-fullname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayFullName(data.fullName);
        })
        .catch(error => {
            console.error('Error fetching user full name:', error);
        });
}

function displayFullName(fullName) {
    const fullNameElement = document.getElementById('user-fullname');
    fullNameElement.textContent = fullName;
}

function fetchSelectedCourses() {
    fetch('/selected-courses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displaySelectedCourses(data);
        })
        .catch(error => {
            console.error('Error fetching selected courses:', error);
        });
}

function displaySelectedCourses(courses) {
    const selectedCoursesElement = document.getElementById('selected-courses');
    selectedCoursesElement.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.textContent = course.name;
        selectedCoursesElement.appendChild(courseElement);
    });
}

function fetchAllCourses() {
    fetch('/courses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayAllCourses(data);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
}

function displayAllCourses(courses) {
    const allCoursesElement = document.getElementById('all-courses');
    allCoursesElement.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.innerHTML = `
            <span>${course.name}</span>
            <button onclick="selectCourse(${course.id})">Select</button>
        `;
        allCoursesElement.appendChild(courseElement);
    });
}

function selectCourse(courseId) {
    fetch('/select-course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        alert('Course selected successfully');
        fetchSelectedCourses();
    })
    .catch(error => {
        console.error('Error selecting course:', error);
    });
}
