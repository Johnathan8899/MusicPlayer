/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/Pause/Next
 * 4. CD rotate
 * 5. Next/Preview
 * 6. Random
 * 7. Next/Repeat when ended
 * 8. Active song.
 * 9. Scroll active song into view.
 * 10. Play song when click.
 */

const PLAYER_STORAGE = 'F8_PLAYER'
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = {
  isPlay: false,
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
  songs: [
    {
      name: "AmThamBenEm",
      singer: "SonTung-MTP",
      path: "./mp3/AmThamBenEm.mp3",
      image: "./img/AmThamBenEm.png",
    },
    {
      name: "AnhSoMatEm",
      singer: "365Band",
      path: "./mp3/AnhSoMatEm.mp3",
      image: "./img/AnhSoMatEm.png",
    },
    {
      name: "EmCuaNgayHomQua",
      singer: "SonTung-MTP",
      path: "./mp3/EmCuaNgayHomQua.mp3",
      image: "./img/EmCuaNgayHomQua.png",
    },
    {
      name: "VaNhuThe",
      singer: "365Band",
      path: "./mp3/VaNhuThe.mp3",
      image: "./img/VaNhuThe.png",
    },
    {
      name: "DenDaKhongDuong",
      singer: "Amee FT Bray",
      path: "./mp3/DenDaKhongDuong.mp3",
      image: "./img/DenDaKhongDuong.png",
    },
    {
      name: "EmBe",
      singer: "Amee FT Karik",
      path: "./mp3/EmBe.mp3",
      image: "./img/EmBe.png",
    },
    {
      name: "Bones",
      singer: "Imagine Dragons",
      path: "./mp3/Bones.mp3",
      image: "./img/Bones.png",
    },
    {
      name: "ExsHateMe",
      singer: "Amee FT Karik",
      path: "./mp3/ExsHateMe.mp3",
      image: "./img/ExsHateMe.png",
    },
    {
      name: "ExsHateMe2",
      singer: "Amee FT Karik",
      path: "./mp3/ExsHateMe2.mp3",
      image: "./img/ExsHateMe2.png",
    },
    {
      name: "NoiAnhKhongThuocVe",
      singer: "365Band",
      path: "./mp3/NoiAnhKhongThuocVe.mp3",
      image: "./img/NoiAnhKhongThuocVe.png",
    },
  ],
  setConfig: function(key, value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config));
  },
  // Render dùng để đọc api trong object songs và hiển thị lên trình duyệt.
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    playList.innerHTML = htmls.join("");
  },
  handleEvent: function () {
    // Xử lý cd quay 360 độ:
    const cdThumbAnimation = cdThumb.animate([
        { transform: 'rotate(360deg)'}
    ], {
        duration: 10000, //// Quay 1 vòng 10s.
        iterations: Infinity // Vòng lặp: Vô hạn.
    });
    cdThumbAnimation.pause();
 
    // Xử lý khi phóng to thu nhỏ:
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const cdNewWidth = cdWidth - scrollTop;
      cd.style.width = cdNewWidth > 0 ? cdNewWidth + "px" : 0;
      // Làm mờ hình ảnh bằng cách sử dụng độ rộng mới / độ rộng ban đầu.
      cd.style.opacity = cdNewWidth / cdWidth;
    };
    // Xử lý khi click vào nút play, pause:
    const _this = this;
    playBtn.onclick = function () {
      if (_this.isPlay) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song được play:
    audio.onplay = function () {
        _this.isPlay = true;
        player.classList.add("playing");
        cdThumbAnimation.play();
    };
    // Khi song được pause:
    audio.onpause = function () {
      _this.isPlay = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };
    // Khi tiến độ bài hát được thay đổi:
    audio.ontimeupdate = function () {
      // Vì audio.duration mặc định trả về false, mà nó trả về NAN đầu tiên nên bỏ vào đây để nó chạy luôn
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // Xử lý khi tua đến đoạn cần phát:
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
      audio.play();
    };

    // Xử lý khi next song:
    
    nextBtn.onclick = function(){
        if (_this.isRandom){
            _this.playRandomSong();

        } else {
            _this.nextSong();
        } 
        audio.play();
        _this.render();
        _this.activeWhenNextSong();
    }

    // Xử lý khi prev song:
    prevBtn.onclick = function(){
        if (_this.isRandom){
            _this.playRandomSong();

        } else {
            _this.prevSong();
        } 
        audio.play();
        _this.render();
        _this.activeWhenNextSong();
    }

    // Xử lý khi random song:
    randomBtn.onclick = function(){ 
        _this.isRandom = !_this.isRandom;
        randomBtn.classList.toggle('active', _this.isRandom);
        _this.setConfig('isRandom', _this.isRandom);
    }

    // Xử lý next Song khi ended:
    audio.onended = function(e){
      if (_this.isRepeat){
        audio.play();
      } else {
        nextBtn.click();
      }
    }

    // Xử lý khi repeat song:
    repeatBtn.onclick = function(e){
        _this.isRepeat = !_this.isRepeat;
        repeatBtn.classList.toggle('active', _this.isRepeat);
        _this.setConfig('isRepeat', _this.isRepeat);
    }

    // Xử lý khi click vào bài hát thì sẽ chạy:
    playList.onclick = function(e){
      // Xử lý khi click vào song:
      const clickSong = e.target.closest('.song:not(.active)');

      if (clickSong || e.target.closest('.option')){
        // Đặt data-index tại attribute của song, sau đó phải get được cái index cần click để bật đúng bài đó.
        if (clickSong){
          // clickSong.getAttribute('data-index') hoặc clickSong.dataset.index
          _this.currentIndex = Number(clickSong.dataset.index);
          _this.getCurrentSong();
          _this.render();
          audio.play();
        }
        // Xử lý khi click vào nút option (tự làm):
        // if (){

        // }
      };
    }
  },
  // defineProperty có 3 tham số:
  // Tham số 1: Object cần định nghĩa (ở dưới sử dụng this)
  // Tham số 2: Tên của property.
  // Tham số 3: Property descriptor: configurable, enumerable, writabl và value.
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  getCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    console.log(heading, cdThumb, audio);
  },
  nextSong: function(){
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
    }
    this.getCurrentSong();
  },
  prevSong: function(){
    this.currentIndex--;
    if (this.currentIndex <= 0){
        this.currentIndex = this.songs.length -1;
    }
    this.getCurrentSong();
  },
  playRandomSong: function(){
     let newIndexSong;
     do {
        newIndexSong = Math.floor(Math.random() * this.songs.length);
     } while (newIndexSong === this.currentIndex);
     this.currentIndex = newIndexSong;
     this.getCurrentSong();
  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  activeWhenNextSong: function(){
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  },
  // Mục đích viết hàm start ở trong object để khi định nghĩa hết trong render và gọi luôn trong start luôn, không phải gọi nhiều lần và gọi nhiều thứ.
  start: function () {

    // Gán cấu hình từ config vào ứng dụng:
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lý các sự kiện
    this.handleEvent();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng.
    this.getCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle('active', _this.isRandom);
    repeatBtn.classList.toggle('active', _this.isRepeat);
  },
};

app.start();
