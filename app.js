"use strict";

/* =========================================================
   DOLABIMDA NE VAR?
   GELİŞMİŞ TARİF EŞLEŞTİRME MOTORU
========================================================= */

const DATA_FILE = "./recipes.json";

let recipes = [];
let selectedIngredients = [];
let currentResults = [];


/* =========================================================
   DOM
========================================================= */

const ingredientInput = document.getElementById("ingredientInput");
const addButton = document.getElementById("addButton");
const findButton = document.getElementById("findButton");
const ingredientTags = document.getElementById("ingredientTags");

const emptyState = document.getElementById("emptyState");
const resultsSection = document.getElementById("resultsSection");
const recipeGrid = document.getElementById("recipeGrid");

const resultCount = document.getElementById("resultCount");
const resultIngredients = document.getElementById("resultIngredients");

const sortSelect = document.getElementById("sortSelect");

const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");

const loading = document.getElementById("loading");
const themeButton = document.getElementById("themeButton");


/* =========================================================
   MALZEME SÖZLÜĞÜ
========================================================= */

const aliases = {

    "yumurta": [
        "yumurta",
        "yumurtalar",
        "yumurtası",
        "yumurtasi",
        "yumurtalı",
        "yumurtali"
    ],

    "patates": [
        "patates",
        "patatesler",
        "patatesi",
        "patatesli"
    ],

    "domates": [
        "domates",
        "domatesler",
        "domatesi",
        "domatesli"
    ],

    "yeşil fasulye": [
        "yeşil fasulye",
        "yesil fasulye",
        "taze fasulye",
        "taze fasulye",
        "fasulye",
        "fasulyesi"
    ],

    "kuru fasulye": [
        "kuru fasulye",
        "kuru fasulyesi"
    ],

    "soğan": [
        "soğan",
        "sogan",
        "soğanlar",
        "soğanı",
        "sogani"
    ],

    "biber": [
        "biber",
        "biberler",
        "biberi",
        "yeşil biber",
        "yesil biber",
        "kırmızı biber",
        "kirmizi biber",
        "sivri biber"
    ],

    "tavuk": [
        "tavuk",
        "tavuk eti",
        "tavuk göğsü",
        "tavuk gogsu",
        "tavuklu",
        "tavuk but",
        "tavuk butu"
    ],

    "peynir": [
        "peynir",
        "peyniri",
        "beyaz peynir",
        "lor",
        "lor peyniri",
        "kaşar",
        "kasar",
        "kaşar peyniri",
        "kasar peyniri"
    ],

    "yoğurt": [
        "yoğurt",
        "yogurt",
        "yoğurdu",
        "yogurdu"
    ],

    "sarımsak": [
        "sarımsak",
        "sarimsak",
        "sarımsağı",
        "sarimsagi"
    ],

    "maydanoz": [
        "maydanoz",
        "maydanozu"
    ],

    "dereotu": [
        "dereotu",
        "dere otu"
    ],

    "limon": [
        "limon",
        "limonu",
        "limon suyu"
    ],

    "havuç": [
        "havuç",
        "havuc",
        "havuçu"
    ],

    "makarna": [
        "makarna",
        "makarnası",
        "makarnasi",
        "makarnalar"
    ],

    "kıyma": [
        "kıyma",
        "kiyma",
        "kıymalı",
        "kiymali",
        "dana kıyma",
        "dana kiyma"
    ],

    "bulgur": [
        "bulgur",
        "bulguru"
    ],

    "ince bulgur": [
        "ince bulgur",
        "köftelik bulgur",
        "kısırlık bulgur",
        "kisirlik bulgur"
    ],

    "mercimek": [
        "mercimek",
        "mercimeği",
        "mercimegi",
        "kırmızı mercimek",
        "kirmizi mercimek"
    ],

    "nohut": [
        "nohut",
        "nohutu"
    ],

    "bezelye": [
        "bezelye",
        "bezelyesi"
    ],

    "domates salçası": [
        "domates salçası",
        "domates salcasi",
        "salça",
        "salca",
        "salçası",
        "salcasi"
    ],

    "biber salçası": [
        "biber salçası",
        "biber salcasi"
    ],

    "zeytinyağı": [
        "zeytinyağı",
        "zeytinyagi",
        "zeytinyağ"
    ],

    "tereyağı": [
        "tereyağı",
        "tereyagi",
        "tereyağ"
    ],

    "süt": [
        "süt",
        "sut"
    ],

    "şeker": [
        "şeker",
        "seker"
    ],

    "irmik": [
        "irmik"
    ],

    "tonbalığı": [
        "tonbalığı",
        "ton balığı",
        "tonbaligi",
        "ton baligi",
        "ton balık",
        "ton balik"
    ],

    "salatalık": [
        "salatalık",
        "salatalik",
        "salatalığı",
        "salataligi"
    ],

    "kabak": [
        "kabak",
        "kabağı",
        "kabagi",
        "kabaklı",
        "kabakli"
    ],

    "patlıcan": [
        "patlıcan",
        "patlican",
        "patlıcanı",
        "patlicani"
    ],

    "ıspanak": [
        "ıspanak",
        "ispanak",
        "ıspanağı",
        "ispanagi"
    ],

    "mantar": [
        "mantar",
        "mantarı",
        "mantari"
    ],

    "pirinç": [
        "pirinç",
        "pirinc",
        "pirinci",
        "pirinçli",
        "pirincli"
    ],

    "un": [
        "un",
        "buğday unu",
        "bugday unu"
    ],

    "mısır": [
        "mısır",
        "misir",
        "mısırı",
        "misiri"
    ],

    "zeytin": [
        "zeytin",
        "zeytini"
    ],

    "ceviz": [
        "ceviz",
        "cevizi"
    ],

    "fındık": [
        "fındık",
        "findik"
    ],

    "elma": [
        "elma",
        "elması",
        "elmasi"
    ],

    "muz": [
        "muz",
        "muzu"
    ],

    "çilek": [
        "çilek",
        "cilek"
    ],

    "portakal": [
        "portakal",
        "portakalı",
        "portakali"
    ],

    "kabak çekirdeği": [
        "kabak çekirdeği",
        "kabak cekirdegi"
    ],

    "krema": [
        "krema",
        "sıvı krema",
        "sivi krema"
    ],

    "kaşar peyniri": [
        "kaşar",
        "kasar",
        "kaşar peyniri",
        "kasar peyniri"
    ]
};


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(text) {

    return String(text || "")
        .toLocaleLowerCase("tr-TR")
        .replace(/ı/g, "i")
        .replace(/İ/g, "i")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "c")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   CANONICAL
========================================================= */

function getCanonicalIngredient(value) {

    const normalized = normalize(value);

    if (!normalized) {
        return null;
    }

    for (const canonical of Object.keys(aliases)) {

        const list = aliases[canonical];

        for (const alias of list) {

            if (normalize(alias) === normalized) {
                return canonical;
            }

        }

    }

    return normalized;

}


/* =========================================================
   TOKENLER
========================================================= */

function getTokens(value) {

    return normalize(value)
        .split(" ")
        .filter(Boolean);

}


/* =========================================================
   AKILLI MALZEME EŞLEŞMESİ
========================================================= */

function matchesIngredient(userIngredient, recipeIngredient) {

    const user = normalize(userIngredient);
    const recipe = normalize(recipeIngredient);

    if (!user || !recipe) {
        return false;
    }

    if (user === recipe) {
        return true;
    }


    const userCanonical =
        getCanonicalIngredient(user);

    const recipeCanonical =
        getCanonicalIngredient(recipe);


    if (
        userCanonical === recipeCanonical
    ) {
        return true;
    }


    /*
       Örneğin:

       ton balığı
       tonbalığı

       normalize edildiğinde:
       ton baligi
       tonbaligi

       Bu yüzden ayrıca boşluksuz kontrol yapıyoruz.
    */

    const userCompact =
        user.replace(/\s/g, "");

    const recipeCompact =
        recipe.replace(/\s/g, "");


    if (
        userCompact === recipeCompact
    ) {
        return true;
    }


    /*
       Alias listelerinde aynı grupta bulunuyorsa
       eşleşir.
    */

    for (const canonical of Object.keys(aliases)) {

        const group =
            aliases[canonical]
                .map(normalize);

        if (
            group.includes(user) &&
            group.includes(recipe)
        ) {

            return true;

        }

    }


    /*
       Çok kelimeli malzemelerde kontrollü
       parça eşleşmesi.
    */

    const userTokens = getTokens(user);
    const recipeTokens = getTokens(recipe);


    if (
        userTokens.length > 1 &&
        recipeTokens.length > 1
    ) {

        const common =
            userTokens.filter(
                token =>
                    recipeTokens.includes(token)
            );

        if (
            common.length >=
            Math.min(
                userTokens.length,
                recipeTokens.length
            )
        ) {

            return true;

        }

    }


    return false;

}


/* =========================================================
   TARİF ANA MALZEME KONTROLÜ
========================================================= */

function hasMainIngredient(recipe) {

    if (
        !Array.isArray(recipe.mainIngredients) ||
        recipe.mainIngredients.length === 0
    ) {

        return false;

    }

    return recipe.mainIngredients.some(
        main =>
            selectedIngredients.some(
                user =>
                    matchesIngredient(
                        user,
                        main
                    )
            )
    );

}


/* =========================================================
   MALZEME SAYISI
========================================================= */

function uniqueIngredients(list) {

    const result = [];

    list.forEach(item => {

        const canonical =
            getCanonicalIngredient(item);

        if (
            canonical &&
            !result.includes(canonical)
        ) {

            result.push(canonical);

        }

    });

    return result;

}


/* =========================================================
   TARİF SKORU
========================================================= */

function calculateMatch(recipe) {

    const ingredients =
        Array.isArray(recipe.ingredients)
            ? uniqueIngredients(recipe.ingredients)
            : [];

    const matched = [];
    const missing = [];


    ingredients.forEach(ingredient => {

        const found =
            selectedIngredients.some(
                userIngredient =>
                    matchesIngredient(
                        userIngredient,
                        ingredient
                    )
            );

        if (found) {

            matched.push(ingredient);

        } else {

            missing.push(ingredient);

        }

    });


    const mainMatched =
        hasMainIngredient(recipe);


    /*
       Kullanıcının malzemelerinden kaç tanesi
       tarifte bulunuyor?
    */

    const userMatches =
        selectedIngredients.filter(
            user =>
                ingredients.some(
                    recipeIngredient =>
                        matchesIngredient(
                            user,
                            recipeIngredient
                        )
                )
        );


    /*
       Tarifin malzemelerinin yüzde kaçı var?
    */

    const ingredientPercentage =
        ingredients.length
            ? Math.round(
                matched.length /
                ingredients.length *
                100
            )
            : 0;


    /*
       Ana malzeme varsa çok ciddi bonus.
    */

    let score =
        ingredientPercentage;


    if (mainMatched) {

        score += 45;

    }


    /*
       Kullanıcının birden fazla malzemesi
       tarifte kullanılıyorsa bonus.
    */

    score +=
        Math.min(
            userMatches.length * 7,
            35
        );


    /*
       Eksik malzeme cezası.
    */

    score -=
        Math.min(
            missing.length * 2,
            24
        );


    /*
       Ana malzeme yoksa tarifin maksimum skoru
       düşük tutuluyor.
    */

    if (
        recipe.mainIngredients &&
        recipe.mainIngredients.length &&
        !mainMatched
    ) {

        score = Math.min(score, 38);

    }


    /*
       Tam uyum.
    */

    if (
        matched.length > 0 &&
        missing.length === 0
    ) {

        score += 20;

    }


    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(score)
            )
        );


    return {

        percentage: ingredientPercentage,

        score,

        matched,

        missing,

        mainIngredientMatched:
            mainMatched,

        userMatches:
            userMatches.length

    };

}


/* =========================================================
   MALZEME EKLE
========================================================= */

function addIngredient(value) {

    const parts =
        String(value || "")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);


    parts.forEach(part => {

        const ingredient =
            getCanonicalIngredient(part);


        if (
            ingredient &&
            !selectedIngredients.includes(
                ingredient
            )
        ) {

            selectedIngredients.push(
                ingredient
            );

        }

    });


    ingredientInput.value = "";

    renderTags();

    ingredientInput.focus();

}


/* =========================================================
   MALZEME SİL
========================================================= */

function removeIngredient(ingredient) {

    selectedIngredients =
        selectedIngredients.filter(
            item =>
                item !== ingredient
        );

    renderTags();

}


/* =========================================================
   TAGLER
========================================================= */

function renderTags() {

    ingredientTags.innerHTML = "";

    selectedIngredients.forEach(
        ingredient => {

            const tag =
                document.createElement("div");

            tag.className =
                "ingredient-tag";


            const name =
                document.createElement("span");

            name.textContent =
                capitalize(ingredient);


            const remove =
                document.createElement("button");

            remove.type = "button";
            remove.className = "remove-tag";
            remove.textContent = "×";


            remove.setAttribute(
                "aria-label",
                `${ingredient} kaldır`
            );


            remove.addEventListener(
                "click",
                () =>
                    removeIngredient(
                        ingredient
                    )
            );


            tag.appendChild(name);
            tag.appendChild(remove);

            ingredientTags.appendChild(tag);

        }
    );

}


/* =========================================================
   JSON YÜKLE
========================================================= */

async function loadRecipes() {

    loading.classList.remove("hidden");

    emptyState.classList.add("hidden");


    try {

        const response =
            await fetch(
                DATA_FILE,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `recipes.json yüklenemedi: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "recipes.json bir dizi içermiyor."
            );

        }


        recipes = data;


        loading.classList.add("hidden");

        emptyState.classList.remove("hidden");


        console.log(
            `${recipes.length} tarif başarıyla yüklendi.`
        );


    } catch (error) {

        console.error(error);

        loading.classList.add("hidden");

        emptyState.classList.remove("hidden");


        emptyState.innerHTML = `

            <div class="empty-icon">
                ⚠️
            </div>

            <h2>
                Tarif verileri yüklenemedi
            </h2>

            <p>
                <strong>recipes.json</strong>
                dosyasını kontrol et.
            </p>

        `;

    }

}


/* =========================================================
   TARİF ARA
========================================================= */

function searchRecipes() {

    if (!recipes.length) {

        alert(
            "Tarifler henüz yüklenmedi."
        );

        return;

    }


    if (!selectedIngredients.length) {

        alert(
            "Önce en az bir malzeme ekle."
        );

        ingredientInput.focus();

        return;

    }


    currentResults =
        recipes
            .map(recipe => ({

                recipe,

                match:
                    calculateMatch(recipe)

            }))


            /*
               En az bir malzeme eşleşmesi.
            */

            .filter(
                item =>
                    item.match.matched.length > 0
            )


            /*
               Çok düşük skorlu saçma sonuçları
               tamamen çıkar.
            */

            .filter(
                item =>
                    item.match.mainIngredientMatched ||
                    item.match.score >= 25
            );


    sortResults();

    renderResults();

}


/* =========================================================
   SIRALAMA
========================================================= */

function sortResults() {

    const mode =
        sortSelect.value;


    if (mode === "match") {

        currentResults.sort(
            (a, b) => {

                if (
                    b.match.score !==
                    a.match.score
                ) {

                    return (
                        b.match.score -
                        a.match.score
                    );

                }


                if (
                    b.match.mainIngredientMatched !==
                    a.match.mainIngredientMatched
                ) {

                    return (
                        Number(
                            b.match.mainIngredientMatched
                        ) -
                        Number(
                            a.match.mainIngredientMatched
                        )
                    );

                }


                if (
                    b.match.userMatches !==
                    a.match.userMatches
                ) {

                    return (
                        b.match.userMatches -
                        a.match.userMatches
                    );

                }


                return (
                    Number(
                        b.recipe.rating || 0
                    ) -
                    Number(
                        a.recipe.rating || 0
                    )
                );

            }
        );

        return;

    }


    if (mode === "time") {

        currentResults.sort(
            (a, b) =>
                Number(
                    a.recipe.time || 999
                ) -
                Number(
                    b.recipe.time || 999
                )
        );

        return;

    }


    if (mode === "popular") {

        currentResults.sort(
            (a, b) =>
                Number(
                    b.recipe.rating || 0
                ) -
                Number(
                    a.recipe.rating || 0
                )
        );

    }

}


/* =========================================================
   SONUÇLAR
========================================================= */

function renderResults() {

    emptyState.classList.add("hidden");

    resultsSection.classList.remove("hidden");


    resultCount.textContent =
        currentResults.length;


    resultIngredients.innerHTML = "";


    selectedIngredients.forEach(
        ingredient => {

            const span =
                document.createElement("span");

            span.className =
                "result-ingredient";

            span.textContent =
                capitalize(ingredient);

            resultIngredients.appendChild(
                span
            );

        }
    );


    renderCards();


    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   KARTLAR
========================================================= */

function renderCards() {

    recipeGrid.innerHTML = "";


    if (!currentResults.length) {

        recipeGrid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px 20px;
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    😕
                </div>

                <h3>
                    Uygun tarif bulamadık
                </h3>

                <p style="
                    color:var(--muted);
                    margin-top:8px;
                ">
                    Başka bir malzeme veya birkaç
                    malzeme daha eklemeyi dene.
                </p>

            </div>

        `;

        return;

    }


    currentResults.forEach(
        ({ recipe, match }) => {

            const card =
                document.createElement("article");


            card.className =
                "recipe-card";


            const color =
                recipe.color ||
                "#fff0e8";


            let matchHTML;


            if (
                match.missing.length === 0
            ) {

                matchHTML = `

                    <div class="match-info complete">
                        ✓ Tüm malzemeler sende
                    </div>

                `;

            } else {

                const missing =
                    match.missing
                        .slice(0, 3)
                        .map(capitalize)
                        .join(", ");


                const extra =
                    match.missing.length > 3
                        ? ` +${match.missing.length - 3}`
                        : "";


                matchHTML = `

                    <div class="match-info">

                        🛒 Eksik:
                        ${escapeHTML(
                            missing
                        )}${extra}

                    </div>

                `;

            }


            const rating =
                recipe.rating
                    ? `★ ${recipe.rating}`
                    : "";


            card.innerHTML = `

                <div
                    class="recipe-image"
                    style="background:${escapeAttribute(color)}"
                >

                    <span>
                        ${recipe.emoji || "🍽️"}
                    </span>

                    <div class="match">
                        %${match.score} uyum
                    </div>

                </div>


                <div class="recipe-body">

                    <div class="recipe-category">
                        ${escapeHTML(
                            recipe.category || "Yemek"
                        )}
                    </div>


                    <h3>
                        ${escapeHTML(
                            recipe.name || "Tarif"
                        )}
                    </h3>


                    <p class="recipe-description">
                        ${escapeHTML(
                            recipe.description || ""
                        )}
                    </p>


                    <div class="recipe-meta">

                        <span>
                            ⏱️ ${recipe.time || "?"} dk
                        </span>

                        <span>
                            ${escapeHTML(
                                recipe.difficulty || ""
                            )}
                        </span>

                        ${
                            rating
                                ? `
                                    <span class="rating">
                                        ${rating}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    ${matchHTML}

                </div>

            `;


            card.addEventListener(
                "click",
                () =>
                    openRecipe(
                        recipe,
                        match
                    )
            );


            recipeGrid.appendChild(card);

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

function openRecipe(recipe, match) {

    const ingredients =
        Array.isArray(recipe.amounts) &&
        recipe.amounts.length
            ? recipe.amounts
            : recipe.ingredients || [];


    const steps =
        Array.isArray(recipe.steps)
            ? recipe.steps
            : [];


    const source =
        recipe.sourceUrl || "";


    modalContent.innerHTML = `

        <div
            class="modal-image"
            style="
                background:${escapeAttribute(
                    recipe.color || "#fff0e8"
                )};
            "
        >
            ${recipe.emoji || "🍽️"}
        </div>


        <div class="modal-category">
            ${escapeHTML(
                recipe.category || "Yemek"
            )}
        </div>


        <h2>
            ${escapeHTML(
                recipe.name || "Tarif"
            )}
        </h2>


        <p class="modal-description">
            ${escapeHTML(
                recipe.description || ""
            )}
        </p>


        <div class="modal-stats">

            <div class="modal-stat">
                ⏱️ ${recipe.time || "?"} dk
            </div>


            ${
                recipe.difficulty
                    ? `
                        <div class="modal-stat">
                            👨‍🍳
                            ${escapeHTML(
                                recipe.difficulty
                            )}
                        </div>
                    `
                    : ""
            }


            ${
                recipe.rating
                    ? `
                        <div class="modal-stat">
                            ⭐ ${recipe.rating}
                        </div>
                    `
                    : ""
            }


            <div class="modal-stat">
                🥕 %${match.score} uyum
            </div>

        </div>


        <section class="modal-section">

            <h3>
                🛒 Malzemeler
            </h3>


            <div class="ingredients">

                ${ingredients
                    .map(
                        item => `
                            <div class="ingredient-item">
                                ${escapeHTML(item)}
                            </div>
                        `
                    )
                    .join("")
                }

            </div>

        </section>


        ${
            match.missing.length
                ? `
                    <div class="source-box">

                        🛒
                        <strong>
                            Eksik malzemeler:
                        </strong>

                        ${match.missing
                            .map(
                                escapeHTML
                            )
                            .join(", ")}

                    </div>
                `
                : `
                    <div class="source-box">

                        🎉
                        Bu tarif için gerekli
                        malzemelerin tamamı sende!

                    </div>
                `
        }


        <section class="modal-section">

            <h3>
                👨‍🍳 Yapılışı
            </h3>


            ${
                steps.length
                    ? `
                        <div class="steps">

                            ${steps
                                .map(
                                    (step, index) => `
                                        <div class="step">
                                            <strong>
                                                ${index + 1}.
                                            </strong>
                                            ${escapeHTML(step)}
                                        </div>
                                    `
                                )
                                .join("")
                            }

                        </div>
                    `
                    : `
                        <p class="modal-description">
                            Bu tarif için detaylı yapılış
                            bilgisi bulunmamaktadır.
                        </p>
                    `
            }

        </section>


        ${
            source
                ? `
                    <div class="source-box">

                        📚
                        <strong>Kaynak:</strong>

                        <a
                            href="${escapeAttribute(source)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Kaynak sayfasını aç
                        </a>

                    </div>
                `
                : ""
        }

    `;


    modal.classList.remove("hidden");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   MODAL KAPAT
========================================================= */

function closeModal() {

    modal.classList.add("hidden");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


closeModalButton.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   INPUT
========================================================= */

addButton.addEventListener(
    "click",
    () => {

        addIngredient(
            ingredientInput.value
        );

    }
);


ingredientInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addButton.click();

        }

    }
);


/* =========================================================
   HIZLI MALZEMELER
========================================================= */

document
    .querySelectorAll("[data-ingredient]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                addIngredient(
                    button.dataset.ingredient
                );

            }
        );

    });


/* =========================================================
   ARA
========================================================= */

findButton.addEventListener(
    "click",
    searchRecipes
);


/* =========================================================
   SIRALAMA
========================================================= */

sortSelect.addEventListener(
    "change",
    () => {

        sortResults();

        renderCards();

    }
);


/* =========================================================
   TEMA
========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            "dnv-theme"
        );


    if (saved === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeButton.textContent =
            "☀️";

    }

}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        themeButton.textContent =
            dark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "dnv-theme",
            dark
                ? "dark"
                : "light"
        );

    }
);


/* =========================================================
   GÜVENLİ HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(value) {

    const text =
        String(value || "");


    if (!text) {
        return "";
    }


    return (
        text
            .charAt(0)
            .toLocaleUpperCase("tr-TR") +
        text.slice(1)
    );

}


/* =========================================================
   BAŞLAT
========================================================= */

loadTheme();

loadRecipes();
