#!/usr/bin/env python3
"""Build js/data.js for 어휘 탐험대 from the space-word list, the 12-week course, and grade 3–4 additions."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPACE_PATH = Path("/home/ubuntu/.cursor/projects/workspace/uploads/space_words_a2a3.json")
CURR_PATH = Path("/home/ubuntu/.cursor/projects/workspace/uploads/curriculum_12weeks_a4c7.json")

# title, emoji, blurb, word ids (lowercase slugs)
CHAPTERS = [
    ("동물 동산", "🐾", "동물 친구를 구해요", ["cat", "dog", "bird", "bear", "monkey"]),
    ("내 방 탐험", "🛏️", "방 안에 숨은 단어를 찾아요", ["bed", "desk", "book", "pen", "chair"]),
    ("맛있는 식탁", "🍎", "먹고 마시는 말을 배워요", ["apple", "banana", "milk", "water", "bread"]),
    ("색깔 마을", "🎨", "예쁜 색깔 단어를 모아요", ["red", "blue", "yellow", "green", "white", "black", "pink"]),
    ("크기 나라", "📏", "크고 작고 길고 짧아요", ["big", "small", "long", "tall", "short", "new", "fast"]),
    ("우리 가족", "👨‍👩‍👧", "가족 단어를 구해요", ["mom", "dad", "baby", "boy", "girl", "family", "friend"]),
    ("얼굴", "😊", "얼굴에 있는 말", ["eye", "nose", "mouth", "ear", "hair", "face", "head"]),
    ("손과 발", "✋", "몸을 가리키는 말", ["hand", "foot", "finger", "arm", "leg", "shoulder", "knee"]),
    ("하나부터 일곱", "🔢", "작은 수부터 세어요", ["one", "two", "three", "four", "five", "six", "seven"]),
    ("여덟 그리고 열", "🔟", "더 큰 수와 날", ["eight", "nine", "ten", "zero", "many", "time", "day"]),
    ("달려라", "🏃", "몸으로 움직여요", ["run", "swim", "jump", "walk", "fly", "ride", "climb", "hop"], "움직임 나라"),
    ("신나게", "💃", "춤추고 놀아요", ["play", "dance", "sing", "kick", "catch", "throw", "read", "write"], "움직임 나라"),
    ("매일 해요", "👐", "하루에 하는 일", ["eat", "drink", "open", "draw", "wash", "make", "sleep", "cook"], "움직임 나라"),
    ("장난감 상자", "🧸", "가지고 노는 것들", ["ball", "toy", "robot", "bike", "soccer", "game", "song"]),
    ("학교 가방", "🎒", "가방 속 학용품", ["pencil", "bag", "ruler", "eraser", "crayon", "paper", "glue"]),
    ("우리 교실", "🏫", "학교에서 쓰는 말", ["school", "teacher", "student", "class", "listen", "study"]),
    ("과일 바구니", "🍇", "달콤한 과일", ["grape", "peach", "lemon", "pear", "orange", "cherry", "strawberry"]),
    ("채소와 밥", "🥕", "몸에 좋은 음식", ["carrot", "tomato", "potato", "corn", "egg", "rice", "cookie"]),
    ("달콤한 간식", "🍰", "간식 시간", ["cake", "candy", "cheese", "juice", "pizza", "hamburger", "jam"]),
    ("냠냠", "🍽️", "먹고 마시는 것", ["soup", "chicken", "hungry", "breakfast", "lunch"]),
    ("저녁 메뉴", "🌙", "저녁에 먹는 것", ["dinner", "sandwich", "noodle", "ice", "cream", "yogurt", "salad"]),
    ("하늘과 날씨", "☀️", "하늘에서 만나요", ["sun", "moon", "star", "rain", "snow", "cloud", "wind"]),
    ("오늘 날씨", "🌤️", "오늘 하늘은 어때요", ["sunny", "cloudy", "rainy", "snowy", "windy", "warm", "cool"]),
    ("계절", "🍂", "봄 여름 가을 겨울", ["spring", "summer", "fall", "winter", "hot", "cold", "dark"]),
    ("숲속 동물", "🦁", "크고 용감한 동물", ["lion", "tiger", "elephant", "zebra", "giraffe", "horse", "cow"]),
    ("농장 동물", "🐷", "농장에서 만나요", ["pig", "sheep", "duck", "rabbit", "hen", "puppy", "kitten"]),
    ("바다와 산", "🐳", "물과 산의 친구", ["whale", "penguin", "dolphin", "turtle", "fish", "sea", "mountain", "river"]),
    ("작은 친구", "🐭", "작아서 귀여운 동물", ["mouse", "snake", "butterfly", "bee", "ant", "spider", "owl", "frog"]),
    ("자연", "🌳", "풀과 꽃과 나무", ["tree", "flower", "leaf", "grass", "rock", "rainbow", "garden"]),
    ("탈것", "🚗", "타고 가는 것들", ["car", "bus", "train", "taxi", "truck", "boat", "ship"]),
    ("멀리 떠나기", "✈️", "멀리 있는 장소", ["airplane", "subway", "sky", "park", "zoo", "beach", "playground"]),
    ("우리 동네", "🏘️", "집 근처 장소", ["home", "house", "store", "bank", "market", "farm", "city"]),
    ("건물", "🚪", "들어가 보는 곳", ["library", "hospital", "museum", "kitchen", "room", "door", "window"]),
    ("직업", "👮", "일하는 사람들", ["doctor", "nurse", "chef", "farmer", "pilot", "police", "firefighter"]),
    ("옷장", "👕", "몸에 입는 것", ["shirt", "shoe", "cap", "hat", "dress", "pants", "skirt"]),
    ("더 입기", "🧥", "따뜻하게 입어요", ["socks", "coat", "gloves", "scarf", "boots", "jacket", "glasses"]),
    ("기분", "😊", "오늘 기분은요", ["happy", "sad", "angry", "tired", "scared", "sick", "pretty"]),
    ("어떤 모습", "✨", "생김새를 말해요", ["funny", "nice", "strong", "great", "beautiful", "brown", "gray"]),
    ("하루", "⏰", "아침부터 밤까지", ["morning", "night", "today", "now", "early", "late"]),
    ("요일", "📅", "일주일의 이름", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    ("특별한 날", "🎂", "기다리는 날", ["tomorrow", "yesterday", "weekend", "birthday", "week", "year", "hour"]),
    ("아늑한 방", "🛋️", "방 안에 있는 것", ["table", "lamp", "clock", "pillow", "sofa", "mirror", "phone"]),
    ("살림살이", "🍴", "집에서 쓰는 것", ["cup", "plate", "spoon", "fork", "box", "key", "camera"]),
    ("공부 시간", "📚", "공부할 때 필요해요", ["notebook", "scissors", "homework", "computer", "map", "math", "music"]),
    ("예술", "🎹", "그리고 연주하고", ["art", "piano", "picture", "name", "story", "smile"]),
    ("마음", "💖", "좋아하는 마음", ["can", "like", "have", "want", "go", "get", "help"]),
    ("집안일", "🧼", "집 안에서 해요", ["close", "brush", "clean", "sit", "stand"]),
    ("소리와 화면", "📺", "보고 들어요", ["cry", "laugh", "speak", "watch", "tv"]),
    ("인사 말", "🙏", "예의 바른 말", ["thank", "please", "yes", "no", "buy", "gift", "party"]),
    ("사람들", "👤", "누구인지 말해요", ["i", "you", "we", "he", "she", "they", "brother"]),
    ("더 많은 가족", "👑", "우리 곁의 사람들", ["sister", "grandma", "grandpa", "king", "queen", "together", "share"]),
    ("작은 단어 1", "🔤", "문장을 만드는 말", ["a", "an", "the", "my", "your", "it", "this"]),
    ("작은 단어 2", "🔤", "이다, 그리고", ["is", "are", "am", "be", "and", "to", "do"]),
    ("위치", "📍", "어디에 있나요", ["in", "on", "under", "up", "down", "left", "right"]),
    ("질문", "❓", "물어볼 때", ["where", "who", "what", "how", "that", "these", "much"]),
    ("이어 주는 말", "🔗", "말을 이어 줘요", ["for", "at", "too", "with", "after", "before", "very"]),
    ("길 찾기", "🧭", "어디로 갈까요", ["next", "straight", "turn", "well", "high", "last", "every"]),
    ("어제 이야기", "📖", "과거에 한 일", ["was", "went", "saw", "ate", "had", "take", "come"]),
    ("친절", "🤗", "고르고 도와요", ["look", "see", "stop", "give", "hug", "dont", "cant"]),
    ("하나 더", "🦷", "몸과 물건", ["toe", "neck", "teeth", "umbrella", "snowman", "ring", "has"]),
    ("부엌 재료", "🍯", "요리 재료와 빛", ["watermelon", "honey", "butter", "meat", "sugar", "salt", "light", "her"]),
]

EXTRAS = {
    "pen": ("pen", "펜", "🖊️"),
    "chair": ("chair", "의자", "🪑"),
    "pink": ("pink", "분홍색", "🩷"),
    "short": ("short", "짧은", "📏"),
    "baby": ("baby", "아기", "👶"),
    "boy": ("boy", "소년", "👦"),
    "girl": ("girl", "소녀", "👧"),
    "family": ("family", "가족", "👨‍👩‍👧‍👦"),
    "three": ("three", "셋", "3️⃣"),
    "zero": ("zero", "영", "0️⃣"),
    "hop": ("hop", "깡충 뛰다", "🐰"),
    "kick": ("kick", "차다", "⚽"),
    "catch": ("catch", "잡다", "🤲"),
    "game": ("game", "게임", "🎮"),
    "paper": ("paper", "종이", "📄"),
    "glue": ("glue", "풀", "🧴"),
    "student": ("student", "학생", "🧑‍🎓"),
    "pear": ("pear", "배", "🍐"),
    "cherry": ("cherry", "체리", "🍒"),
    "hamburger": ("hamburger", "햄버거", "🍔"),
    "jam": ("jam", "잼", "🍓"),
    "yogurt": ("yogurt", "요거트", "🥛"),
    "salad": ("salad", "샐러드", "🥗"),
    "rain": ("rain", "비", "🌧️"),
    "snow": ("snow", "눈", "❄️"),
    "cloud": ("cloud", "구름", "☁️"),
    "wind": ("wind", "바람", "💨"),
    "dark": ("dark", "어두운", "🌑"),
    "zebra": ("zebra", "얼룩말", "🦓"),
    "puppy": ("puppy", "강아지", "🐶"),
    "kitten": ("kitten", "아기 고양이", "🐱"),
    "dolphin": ("dolphin", "돌고래", "🐬"),
    "turtle": ("turtle", "거북이", "🐢"),
    "bee": ("bee", "벌", "🐝"),
    "ant": ("ant", "개미", "🐜"),
    "spider": ("spider", "거미", "🕷️"),
    "owl": ("owl", "부엉이", "🦉"),
    "hen": ("hen", "암탉", "🐔"),
    "river": ("river", "강", "🏞️"),
    "rock": ("rock", "바위", "🪨"),
    "rainbow": ("rainbow", "무지개", "🌈"),
    "garden": ("garden", "정원", "🌷"),
    "truck": ("truck", "트럭", "🚚"),
    "boat": ("boat", "배", "⛵"),
    "house": ("house", "집", "🏠"),
    "farm": ("farm", "농장", "🚜"),
    "city": ("city", "도시", "🏙️"),
    "window": ("window", "창문", "🪟"),
    "hat": ("hat", "모자", "🎩"),
    "skirt": ("skirt", "치마", "👗"),
    "jacket": ("jacket", "재킷", "🧥"),
    "sad": ("sad", "슬픈", "😢"),
    "angry": ("angry", "화난", "😠"),
    "tired": ("tired", "피곤한", "😴"),
    "scared": ("scared", "무서워하는", "😨"),
    "gray": ("gray", "회색", "🩶"),
    "week": ("week", "주", "📆"),
    "year": ("year", "일 년", "🗓️"),
    "hour": ("hour", "한 시간", "⏱️"),
    "lamp": ("lamp", "램프", "💡"),
    "clock": ("clock", "시계", "🕐"),
    "pillow": ("pillow", "베개", "🛏️"),
    "sofa": ("sofa", "소파", "🛋️"),
    "mirror": ("mirror", "거울", "🪞"),
    "phone": ("phone", "전화", "📱"),
    "cup": ("cup", "컵", "Cups"),
    "plate": ("plate", "접시", "🍽️"),
    "spoon": ("spoon", "숟가락", "🥄"),
    "fork": ("fork", "포크", "🍴"),
    "box": ("box", "상자", "📦"),
    "key": ("key", "열쇠", "🔑"),
    "camera": ("camera", "카메라", "📷"),
    "map": ("map", "지도", "🗺️"),
    "name": ("name", "이름", "🏷️"),
    "story": ("story", "이야기", "📖"),
    "smile": ("smile", "미소", "😄"),
    "help": ("help", "돕다", "🤝"),
    "party": ("party", "파티", "🎉"),
    "grandma": ("grandma", "할머니", "👵"),
    "grandpa": ("grandpa", "할아버지", "👴"),
    "king": ("king", "왕", "🤴"),
    "queen": ("queen", "여왕", "👸"),
    "share": ("share", "나누다", "🎁"),
    "right": ("right", "오른쪽", "➡️"),
    "dont": ("don't", "하지 않다", "🚫"),
    "cant": ("can't", "할 수 없다", "🙅"),
    "look": ("look", "바라보다", "👀"),
    "see": ("see", "보다", "👁️"),
    "stop": ("stop", "멈추다", "🛑"),
    "give": ("give", "주다", "🤲"),
    "hug": ("hug", "안다", "🤗"),
    "come": ("come", "오다", "🚶"),
    "knee": ("knee", "무릎", "🦵"),
    "toe": ("toe", "발가락", "🦶"),
    "neck": ("neck", "목", "🦒"),
    "light": ("light", "빛", "💡"),
    "honey": ("honey", "꿀", "🍯"),
    "butter": ("butter", "버터", "🧈"),
    "meat": ("meat", "고기", "🍖"),
    "sugar": ("sugar", "설탕", "🍬"),
    "salt": ("salt", "소금", "🧂"),
    "i": ("I", "나", "🙋"),
    "is": ("is", "~이다", "🟰"),
    "are": ("are", "~이다 (여럿)", "👥"),
    "am": ("am", "~이다 (나)", "🙋"),
    "be": ("be", "되다", "✨"),
    "and": ("and", "그리고", "➕"),
    "to": ("to", "~로", "➡️"),
    "do": ("do", "하다", "✅"),
    "a": ("a", "하나 (관사)", "1️⃣"),
    "an": ("an", "하나 (모음 앞)", "1️⃣"),
    "the": ("the", "그", "👉"),
    "my": ("my", "나의", "💛"),
    "your": ("your", "너의", "💙"),
    "it": ("it", "그것", "📦"),
    "her": ("her", "그녀의", "👧"),
    "has": ("has", "가지고 있다", "🤲"),
    "in": ("in", "~안에", "📥"),
    "on": ("on", "~위에", "⬆️"),
    "at": ("at", "~에", "📍"),
    "for": ("for", "~을 위해", "🎁"),
    "too": ("too", "~도", "🔁"),
}

# cup emoji fallback if the placeholder slipped in
EXTRAS["cup"] = ("cup", "컵", "🥤")

PALETTE = [
    "#ff6b6b", "#ff922b", "#ffd43b", "#69db7c", "#4dabf7", "#ffa8a8",
    "#ffc078", "#8ce99a", "#74c0fc", "#ff8787", "#63e6be", "#ffd8a8",
    "#a5d8ff", "#ffec99", "#ffb347", "#7bdff2", "#f4a261", "#2ec4b6",
    "#e9c46a", "#ef476f", "#06d6a0", "#118ab2", "#ffd166", "#f9844a",
]

MANUAL = {
    "can": "I can swim.",
    "like": "I like cats.",
    "have": "I have a dog.",
    "want": "I want a toy.",
    "thank": "Thank you.",
    "please": "Please sit down.",
    "yes": "Yes, I can.",
    "no": "No, thank you.",
    "was": "I was happy.",
    "went": "I went home.",
    "saw": "I saw a lion.",
    "ate": "I ate bread.",
    "had": "I had a cookie.",
    "is": "The cat is small.",
    "are": "They are happy.",
    "am": "I am happy.",
    "be": "I want to be kind.",
    "do": "I do my homework.",
    "dont": "I don't run.",
    "cant": "I can't fly.",
    "get": "I get up.",
    "take": "Take an umbrella.",
    "has": "She has a cat.",
    "her": "I see her.",
    "i": "I see a bird.",
    "a": "I have a pen.",
    "an": "I eat an apple.",
    "the": "The cat is big.",
    "my": "This is my bag.",
    "your": "This is your book.",
    "it": "It is a cat.",
    "and": "Mom and dad.",
    "to": "I go to school.",
    "for": "This is for you.",
    "at": "I am at home.",
    "in": "The cat is in the box.",
    "on": "The book is on the desk.",
    "too": "I like you too.",
    "with": "I play with you.",
    "after": "I read after dinner.",
    "before": "I wash before bed.",
    "very": "It is very big.",
    "well": "I can sing well.",
    "high": "I can jump high.",
    "many": "I see many stars.",
    "much": "Thank you very much.",
    "these": "These are shoes.",
    "that": "That is a bird.",
    "this": "This is a book.",
    "who": "Who is she?",
    "what": "What is this?",
    "where": "Where is the cat?",
    "how": "How are you?",
    "next": "The bank is next.",
    "last": "I ate last night.",
    "every": "I read every day.",
    "today": "I am happy today.",
    "now": "I go home now.",
    "together": "We play together.",
    "up": "Stand up, please.",
    "down": "Sit down, please.",
    "left": "Turn left.",
    "right": "Turn right.",
    "you": "You are my friend.",
    "we": "We are friends.",
    "he": "He is my brother.",
    "she": "She is my sister.",
    "they": "They are happy.",
    "tv": "I watch TV.",
    "ice": "I like ice cream.",
    "cream": "I like ice cream.",
    "time": "What time is it?",
    "day": "It is a sunny day.",
    "night": "It is night.",
    "morning": "Good morning.",
    "hungry": "I am hungry.",
    "early": "I get up early.",
    "late": "I am late.",
    "hour": "I wait an hour.",
    "week": "A week has seven days.",
    "year": "A year is long.",
    "birthday": "Today is my birthday.",
    "weekend": "I play on the weekend.",
    "tomorrow": "See you tomorrow.",
    "yesterday": "I was home yesterday.",
    "name": "What is your name?",
    "story": "I read a story.",
    "smile": "I see a smile.",
    "game": "I play a game.",
    "song": "I sing a song.",
    "picture": "I draw a picture.",
    "snowman": "I make a snowman.",
    "umbrella": "I take an umbrella.",
    "gift": "This is a gift.",
    "toy": "I want a toy.",
    "ball": "I have a ball.",
    "bike": "I ride a bike.",
    "soccer": "I play soccer.",
    "party": "We have a party.",
    "computer": "I use a computer.",
    "phone": "This is my phone.",
    "homework": "I do my homework.",
    "math": "I like math.",
    "music": "I like music.",
    "art": "I like art.",
    "class": "I like my class.",
    "book": "I read a book.",
    "map": "I read a map.",
    "friend": "You are my friend.",
    "mom": "I love my mom.",
    "dad": "I love my dad.",
    "baby": "I see a baby.",
    "teacher": "She is a teacher.",
    "student": "I am a student.",
    "brother": "He is my brother.",
    "sister": "She is my sister.",
    "grandma": "I love grandma.",
    "grandpa": "I love grandpa.",
    "help": "I can help you.",
    "hug": "I hug my mom.",
    "give": "I give a gift.",
    "share": "I share my cookie.",
    "come": "Please come in.",
    "go": "I go to school.",
    "look": "Look at the bird.",
    "see": "I see a star.",
    "stop": "Please stop.",
    "watch": "I watch TV.",
    "eat": "I eat bread.",
    "drink": "I drink water.",
    "sleep": "I sleep at night.",
    "read": "I read a book.",
    "write": "I write my name.",
    "listen": "I listen to music.",
    "speak": "I speak English.",
    "study": "I study at home.",
    "wash": "I wash my face.",
    "brush": "I brush my teeth.",
    "clean": "I clean my room.",
    "cook": "I cook with mom.",
    "open": "Open the door.",
    "close": "Close the window.",
    "make": "I make a cake.",
    "draw": "I draw a cat.",
    "buy": "I buy a gift.",
    "turn": "Turn left.",
    "play": "I play a game.",
    "sing": "I sing a song.",
    "ride": "I ride a bike.",
    "fly": "Birds can fly.",
    "run": "I can run fast.",
    "swim": "I can swim.",
    "jump": "I can jump.",
    "walk": "I walk to school.",
    "sit": "I sit on a chair.",
    "stand": "I stand up.",
    "noodle": "I eat noodle soup.",
    "glasses": "I wear glasses.",
    "teeth": "I brush my teeth.",
    "pants": "I wear pants.",
    "socks": "I wear socks.",
    "boots": "I wear boots.",
    "gloves": "I wear gloves.",
    "scissors": "I cut with scissors.",
    "police": "The police help us.",
    "light": "I see the light.",
    "family": "I love my family.",
    "paper": "I write on paper.",
    "glue": "I have glue.",
    "sun": "I see the sun.",
    "moon": "I see the moon.",
    "rain": "I see the rain.",
    "snow": "I see the snow.",
    "wind": "I feel the wind.",
    "spring": "It is spring.",
    "summer": "It is summer.",
    "fall": "It is fall.",
    "winter": "It is winter.",
    "grass": "I see the grass.",
    "cloud": "I see a cloud.",
    "subway": "I ride the subway.",
    "ring": "I see a ring.",
    "key": "This is a key.",
    "box": "The cat is in the box.",
    "under": "The cat is under the desk.",
    "straight": "Go straight.",
    "well": "I can sing well.",
    "fast": "I can run fast.",
    "new": "This book is new.",
    "pretty": "The bird is pretty.",
    "nice": "You are nice.",
    "great": "You are great.",
    "beautiful": "The flower is beautiful.",
    "funny": "The monkey is funny.",
    "strong": "The bear is strong.",
    "hungry": "I am hungry.",
    "sick": "I was sick.",
    "happy": "I am happy.",
    "sad": "I am sad.",
    "angry": "I am angry.",
    "tired": "I am tired.",
    "scared": "I am scared.",
    "hot": "The soup is hot.",
    "cold": "The water is cold.",
    "warm": "The day is warm.",
    "cool": "The wind is cool.",
    "dark": "The night is dark.",
    "sunny": "It is sunny.",
    "cloudy": "It is cloudy.",
    "rainy": "It is rainy.",
    "snowy": "It is snowy.",
    "windy": "It is windy.",
    "big": "The dog is big.",
    "small": "The cat is small.",
    "long": "The pencil is long.",
    "tall": "The giraffe is tall.",
    "short": "The pencil is short.",
    "brown": "The bear is brown.",
    "gray": "The cloud is gray.",
    "pink": "The flower is pink.",
    "red": "The ball is red.",
    "blue": "The bag is blue.",
    "yellow": "The pencil is yellow.",
    "green": "The book is green.",
    "white": "The bird is white.",
    "black": "The hair is black.",
    "orange": "I eat an orange.",
}

EAT_ART = {
    "apple", "banana", "grape", "peach", "lemon", "pear", "cherry", "strawberry",
    "carrot", "tomato", "potato", "egg", "cookie", "hamburger", "sandwich", "cake",
}
EAT_BARE = {
    "bread", "rice", "corn", "candy", "cheese", "pizza", "soup", "chicken",
    "breakfast", "lunch", "dinner", "yogurt", "salad", "jam", "honey", "butter",
    "meat", "sugar", "salt", "watermelon", "ice",
}
DRINK = {"milk", "water", "juice"}
WEAR_ART = {"shirt", "shoe", "cap", "hat", "dress", "skirt", "coat", "scarf", "jacket"}
WEAR_BARE = {"pants", "socks", "boots", "gloves", "glasses"}
BODY = {
    "eye", "nose", "mouth", "ear", "hair", "face", "head", "hand", "foot", "finger",
    "arm", "leg", "shoulder", "knee", "toe", "neck",
}
PLACES = {
    "park", "school", "library", "home", "house", "store", "bank", "market", "farm",
    "city", "hospital", "museum", "kitchen", "room", "zoo", "beach", "playground",
    "garden", "sea", "mountain", "river", "sky", "farm",
}
CAN = {
    "hop", "kick", "catch", "climb", "throw", "cry", "laugh", "dance", "sit", "stand",
}
DAYS = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}
NUMS = {"one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "zero"}
AN_WORDS = {"hour"}


def slug(en: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", en.lower())


def article(en: str) -> str:
    low = en.lower()
    if low in AN_WORDS or low[:1] in "aeiou":
        return "an"
    return "a"


def batchim_particle(ko: str) -> str:
    hs = [ch for ch in ko if "가" <= ch <= "힣"]
    if not hs:
        return "를"
    code = ord(hs[-1]) - 0xAC00
    if code < 0 or code > 11171:
        return "를"
    return "을" if code % 28 else "를"


def short_ko(ko: str) -> str:
    part = re.split(r"[,/]|·", ko)[0].strip()
    part = re.sub(r"\([^)]*\)", "", part).strip()
    return part or ko


def ko_line(sentence: str, ko: str) -> str:
    k = short_ko(ko)
    p = batchim_particle(k)
    if sentence.startswith("I see") or sentence.startswith("Look"):
        return f"나는 {k}{p} 봐요."
    if sentence.startswith("I eat") or "eat " in sentence:
        return f"나는 {k}{p} 먹어요."
    if sentence.startswith("I drink"):
        return f"나는 {k}{p} 마셔요."
    if sentence.startswith("I wear"):
        return f"나는 {k}{p} 입어요."
    if sentence.startswith("I love"):
        return f"나는 {k}{p} 사랑해요."
    if sentence.startswith("I like"):
        return f"나는 {k}{p} 좋아해요."
    if sentence.startswith("I go") or sentence.startswith("I walk"):
        return f"나는 {k}에 가요."
    if sentence.startswith("This is my") or sentence.startswith("This is your"):
        return f"이것은 {k}이에요."
    if sentence.startswith("I have") or sentence.startswith("She has"):
        return f"{k}{p} 가지고 있어요."
    if sentence.startswith("Today is"):
        return f"오늘은 {k}이에요."
    return ""


# Action verbs live in 움직임 나라. Recall blanks are "I can ___." or "Let's ___!"
VERB_SENT = {
    "run": ("I can run.", "나는 달릴 수 있어요."),
    "swim": ("Let's swim!", "같이 수영해요!"),
    "jump": ("I can jump.", "나는 뛸 수 있어요."),
    "walk": ("Let's walk!", "같이 걸어요!"),
    "fly": ("I can fly.", "나는 날 수 있어요."),
    "ride": ("Let's ride!", "같이 타요!"),
    "climb": ("I can climb.", "나는 오를 수 있어요."),
    "hop": ("Let's hop!", "같이 깡충 뛰어요!"),
    "play": ("I can play.", "나는 놀 수 있어요."),
    "dance": ("Let's dance!", "같이 춤춰요!"),
    "sing": ("I can sing.", "나는 노래할 수 있어요."),
    "kick": ("Let's kick!", "같이 차요!"),
    "catch": ("I can catch.", "나는 잡을 수 있어요."),
    "throw": ("Let's throw!", "같이 던져요!"),
    "read": ("I can read.", "나는 읽을 수 있어요."),
    "write": ("Let's write!", "같이 써요!"),
    "eat": ("I can eat.", "나는 먹을 수 있어요."),
    "drink": ("Let's drink!", "같이 마셔요!"),
    "open": ("I can open.", "나는 열 수 있어요."),
    "draw": ("Let's draw!", "같이 그려요!"),
    "wash": ("I can wash.", "나는 씻을 수 있어요."),
    "make": ("Let's make!", "같이 만들어요!"),
    "sleep": ("I can sleep.", "나는 잘 수 있어요."),
    "cook": ("Let's cook!", "같이 요리해요!"),
}


def build_sentence(wid: str, display: str, ko: str):
    if wid in VERB_SENT:
        return VERB_SENT[wid]
    if wid in MANUAL:
        en_s = MANUAL[wid]
    elif wid in DAYS:
        en_s = f"Today is {display}."
    elif wid in NUMS:
        if wid == "one":
            en_s = "I see one star."
        else:
            en_s = f"I see {display} stars."
    elif wid in DRINK:
        en_s = f"I drink {display}."
    elif wid in EAT_BARE:
        en_s = f"I eat {display}."
    elif wid in EAT_ART:
        en_s = f"I eat {article(display)} {display}."
    elif wid in WEAR_BARE:
        en_s = f"I wear {display}."
    elif wid in WEAR_ART:
        en_s = f"I wear {article(display)} {display}."
    elif wid in BODY:
        en_s = f"This is my {display}."
    elif wid in PLACES:
        en_s = f"I go to the {display}."
    elif wid in CAN:
        en_s = f"I can {display}."
    else:
        en_s = f"I see {article(display)} {display}."
    return en_s, ko_line(en_s, ko)


def make_blank(sentence: str, display: str) -> str:
    pat = re.compile(rf"(?<![A-Za-z]){re.escape(display)}(?!['A-Za-z])", re.I)
    m = pat.search(sentence)
    if not m:
        raise SystemExit(f"BLANK FAIL {display!r} not in {sentence!r}")
    return sentence[: m.start()] + "___" + sentence[m.end() :]


def lighten(hexcol: str, fallback: str) -> str:
    if not isinstance(hexcol, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", hexcol or ""):
        return fallback
    r, g, b = int(hexcol[1:3], 16), int(hexcol[3:5], 16), int(hexcol[5:7], 16)
    if b > r and b > g and g < 170 and (b - g) > 25:
        return "#ff922b"
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if lum < 110:
        r = int(r * 0.4 + 255 * 0.6)
        g = int(g * 0.4 + 255 * 0.6)
        b = int(b * 0.4 + 255 * 0.6)
    return f"#{r:02x}{g:02x}{b:02x}"


def names_for(base: str) -> list:
    base = (base or "워드몬").strip()
    hs = "".join(ch for ch in base if "가" <= ch <= "힣")
    short = (hs or base)[:2] or "워드"
    mid = "빅" + short
    final = short + "킹"
    if mid == base:
        mid = "슈퍼" + short
    return [base, mid, final]


def gen_misses(display: str, acc) -> list:
    w = display.lower()
    out = []

    def add(x):
        x = x.lower().strip()
        if not x or x == w or x in out:
            return
        if any(ch not in "abcdefghijklmnopqrstuvwxyz'" for ch in x):
            return
        if abs(len(x) - len(w)) > 2 and len(w) > 2:
            return
        out.append(x)

    for a in acc or []:
        add(str(a))
        if len(out) >= 6:
            break
    vowels = "aeiou"
    if len(w) >= 2:
        add(w[:-1])
        add(w[0] + w[0] + w[1:])
        add(w[:-2] + w[-1] + w[-2] if len(w) >= 2 else "")
    for i, ch in enumerate(w):
        if ch in vowels:
            add(w[:i] + ("e" if ch != "e" else "a") + w[i + 1 :])
            break
    if len(w) == 1:
        for ch in "aeiou":
            add(ch)
    # keep a few that are not trivial empty
    cleaned = [m for m in out if m != w][:5]
    while len(cleaned) < 3:
        n = len(cleaned)
        add(w + "e")
        add("e" + w if not w.startswith("e") else "a" + w)
        add(w.replace("a", "e") if "a" in w else w + "y")
        cleaned = [m for m in out if m != w][:5]
        if len(cleaned) == n:
            cleaned.append("x" + w)
            break
    return cleaned[:5]


def main():
    space = json.loads(SPACE_PATH.read_text())
    curr = json.loads(CURR_PATH.read_text())
    by_show = {}
    for key, val in curr["W"].items():
        show = (val.get("show") or key).lower()
        by_show.setdefault(show, val)
        by_show.setdefault(slug(show), val)

    space_words = {}
    for unit in space["units"]:
        for w in unit["words"]:
            sid = slug(w["en"])
            space_words[sid] = w

    chapters = []
    words = {}
    seen = []
    missing_src = []
    for idx, row in enumerate(CHAPTERS, start=1):
        title, emo, blurb, ids = row[:4]
        world = row[4] if len(row) > 4 else ""
        if not 5 <= len(ids) <= 8:
            raise SystemExit(f"chapter size {title} {len(ids)}")
        for wid in ids:
            if wid in words:
                raise SystemExit(f"duplicate word {wid}")
            seen.append(wid)
            if wid in space_words:
                sw = space_words[wid]
                display, ko, icon = sw["en"], sw["ko"], sw["emo"]
                if wid == "tv":
                    display = "TV"
            elif wid in EXTRAS:
                display, ko, icon = EXTRAS[wid]
            else:
                missing_src.append(wid)
                continue
            meta = by_show.get(wid) or by_show.get(display.lower()) or {}
            base_name = meta.get("name") or (short_ko(ko)[:2] + "몬")
            # keep names hangul-friendly
            if not any("가" <= ch <= "힣" for ch in base_name):
                base_name = short_ko(ko)[:2] + "몬"
            nm = names_for(base_name)
            col = lighten(meta.get("col") or "", PALETTE[(idx + len(wid)) % len(PALETTE)])
            sentence, sentence_ko = build_sentence(wid, display, ko)
            blank = make_blank(sentence, display)
            words[wid] = {
                "id": wid,
                "en": display,
                "ko": short_ko(ko),
                "emo": icon,
                "sentence": sentence,
                "sentenceKo": sentence_ko,
                "blank": blank,
                "names": nm,
                "col": col,
                "shape": (sum(ord(c) for c in wid) + idx) % 4,
                "misses": gen_misses(display, meta.get("acc") or []),
                "verb": wid in VERB_SENT,
                "act": wid if wid in VERB_SENT else "",
            }
        chapter = {
            "id": f"c{idx:02d}",
            "title": title,
            "emo": emo,
            "blurb": blurb,
            "words": ids,
        }
        if world:
            chapter["world"] = world
        chapters.append(chapter)

    if missing_src:
        raise SystemExit("missing source: " + ", ".join(sorted(set(missing_src))))
    missing = sorted(set(space_words) - set(words))
    if missing:
        raise SystemExit("space words not used: " + ", ".join(missing))

    data = {"chapters": chapters, "words": words}
    out_js = ROOT / "js" / "data.js"
    out_js.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    out_js.write_text("window.WM_DATA=" + payload + ";\n", encoding="utf-8")
    print(f"chapters {len(chapters)} words {len(words)} bytes {out_js.stat().st_size}")
    # preview sentences
    prev = ROOT / "tools" / "_sentences_preview.txt"
    lines = [f"{wid}\t{words[wid]['en']}\t{words[wid]['ko']}\t{words[wid]['sentence']}\t{words[wid]['blank']}" for wid in seen]
    prev.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
