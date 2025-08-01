let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const resetBtn = document.querySelector('#reset-btn');

// Animate score pop
const animateScore = (el) => {
  el.classList.add('score-pop');
  setTimeout(() => el.classList.remove('score-pop'), 300);
};

// Animate message fade-in
const animateMsg = () => {
  msg.classList.remove('msg-animate');
  void msg.offsetWidth; // trigger reflow for restarting animation
  msg.classList.add('msg-animate');
};

// Confetti animation on win
const confetti = () => {
  const colors = ["🎉", "✨", "🎊", "⭐", "🟡"];
  for(let i=0; i<18; i++) {
    const el = document.createElement('span');
    el.textContent = colors[Math.floor(Math.random()*colors.length)];
    el.style.position = 'fixed';
    el.style.left = (Math.random()*100)+'vw';
    el.style.top = '-2rem';
    el.style.fontSize = (Math.random()*20 + 22) + "px";
    el.style.pointerEvents = 'none';
    el.style.transition = 'transform 1.1s cubic-bezier(.61,3.57,.34,1.14)';
    document.body.appendChild(el);
    setTimeout(()=>{
      el.style.transform = `translateY(${window.innerHeight*0.8}px) rotate(${Math.random()*360}deg)`;
    },50);
    setTimeout(()=>el.remove(), 1300);
  }
};

// Highlight user and comp choices
const highlightChoices = (userId, compId) => {
  choices.forEach(c => c.classList.remove('user-picked', 'comp-picked'));
  document.getElementById(userId).classList.add('user-picked');
  document.getElementById(compId).classList.add('comp-picked');
  setTimeout(() => {
    choices.forEach(c => c.classList.remove('user-picked', 'comp-picked'));
  }, 1000);
};

// Generate computer choice
const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randIdx = Math.floor(Math.random() * 3);
  return options[randIdx];
};

// Draw game scenario
const drawGame = () => {
  msg.innerText = "🤝 Game was Draw. Play again!";
  msg.style.background = "linear-gradient(90deg, #cbe6fb 40%, #fff2cf 100%)";
  animateMsg();
};

// Show winner and update scores
const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    animateScore(userScorePara);
    msg.innerText = `🎉 You win! Your ${userChoice} beats ${compChoice}`;
    msg.style.background = "linear-gradient(90deg,#18c252 30%,#33f378 100%)";
    confetti();
    winSound.currentTime = 0;
    winSound.play();
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    animateScore(compScorePara);
    msg.innerText = `😥 You lost. ${compChoice} beats your ${userChoice}`;
    msg.style.background = "linear-gradient(90deg,#dd1236 30%,#fdeeaf 100%)";
  }
  animateMsg();
};

// Play game logic
const playGame = (userChoice) => {
  const compChoice = genCompChoice();
  highlightChoices(userChoice, compChoice);

  if (userChoice === compChoice) {
    drawGame();
  } else {
    let userWin = true;
    if (userChoice === "rock") userWin = compChoice === "paper" ? false : true;
    else if (userChoice === "paper") userWin = compChoice === "scissors" ? false : true;
    else userWin = compChoice === "rock" ? false : true;

    showWinner(userWin, userChoice, compChoice);
  }
};

// Add ripple animation + play game + click sound
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // Click sound
    if(clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    // Ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = choice.getBoundingClientRect(); 
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    choice.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // Play game
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// Reset button clears scores and message
resetBtn.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  userScorePara.innerText = 0;
  compScorePara.innerText = 0;
  msg.innerText = "Game reset. Play again!";
  msg.style.background = "linear-gradient(90deg, #5f5f5f, #a1a1a1)";
  choices.forEach(c => c.classList.remove('user-picked', 'comp-picked'));
});

