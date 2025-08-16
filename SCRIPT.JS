const form = document.getElementById("result-form");
const tableBody = document.querySelector("#result-table tbody");

let results = JSON.parse(localStorage.getItem("results")) || [];

function calculateGrade(avg) {
  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  if (avg >= 40) return "D";
  return "F";
}

function renderResults() {
  tableBody.innerHTML = "";
  results.forEach((res, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${res.name}</td>
      <td>${res.total}</td>
      <td>${res.average.toFixed(2)}</td>
      <td>${res.grade}</td>
      <td><button onclick="deleteResult(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  renderStats();
}

function renderStats() {
  const highest = document.getElementById("highest");
  const lowest = document.getElementById("lowest");
  const topThree = document.getElementById("top-three");

  if (results.length === 0) {
    highest.textContent = "N/A";
    lowest.textContent = "N/A";
    topThree.innerHTML = "";
    return;
  }

  const sorted = [...results].sort((a, b) => b.average - a.average);

  highest.textContent = `${sorted[0].name} (${sorted[0].average.toFixed(2)})`;
  lowest.textContent = `${sorted[sorted.length - 1].name} (${sorted[sorted.length - 1].average.toFixed(2)})`;

  topThree.innerHTML = "";
  sorted.slice(0, 3).forEach((student) => {
    const li = document.createElement("li");
    li.textContent = `${student.name} - ${student.average.toFixed(2)}%`;
    topThree.appendChild(li);
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const s1 = parseFloat(document.getElementById("subject1").value);
  const s2 = parseFloat(document.getElementById("subject2").value);
  const s3 = parseFloat(document.getElementById("subject3").value);

  if (!name || isNaN(s1) || isNaN(s2) || isNaN(s3)) {
    alert("Please enter valid values.");
    return;
  }

  const total = s1 + s2 + s3;
  const average = total / 3;
  const grade = calculateGrade(average);

  results.push({ name, total, average, grade });
  localStorage.setItem("results", JSON.stringify(results));

  form.reset();
  renderResults();
});

// Corrected deleteResult function
function deleteResult(index) {
  results.splice(index, 1);
  localStorage.setItem("results", JSON.stringify(results));
  renderResults();
}

renderResults();
