// ===============================
// TASK CENTER
// ===============================

async function loadTasks() {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const { data: tasks } = await App.supabase
    .from("tasks")
    .select("*")
    .eq("active", true);

  const { data: userTasks } = await App.supabase
    .from("user_tasks")
    .select("*")
    .eq("user_id", user.id);

  renderTasks(tasks, userTasks || []);
}

function renderTasks(tasks, userTasks) {
  const container = document.getElementById("tasksList");
  container.innerHTML = "";

  tasks.forEach(task => {
    const completed = userTasks.some(t => t.task_id === task.id);
    const btn = completed
      ? `<button disabled>Completed</button>`
      : `<button onclick="completeTask('${task.id}', ${task.reward})">Complete</button>`;

    container.innerHTML += `
      <div class="task">
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <span>Reward: ${task.reward}</span>
        ${btn}
      </div>
    `;
  });
}

async function completeTask(taskId, reward) {
  const user = await UserService.getCurrentUserSafe();
  if (!user) return;

  const { error } = await App.supabase
    .from("user_tasks")
    .insert({
      user_id: user.id,
      task_id: taskId
    });

  if (error) {
    alert("Already completed");
    return;
  }

  await Earnings.addEarning({
    userId: user.id,
    sourceUserId: user.id,
    level: 0,
    amount: reward,
    type: "task"
  });

  alert("Task completed");
  loadTasks();
}

// ===============================
// EXPORT
// ===============================

window.TaskCenter = {
  loadTasks
};
