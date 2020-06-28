
export function validateInput() {

}

function nameCheck() {

  /*

    A-Z
    a-z
    À-ú(accents)
    0-9
    \s (whitespace)
    \. (period)
    ()
    '
    ,
    -
    1-65chars


    const paragraph = 'Señor C. Du, M.D. (biology)';
    const regex = /^[A-Za-zÀ-ú0-9\s\.()',-]{1,65}$/;
    const found = regex.test(paragraph);
    console.log(found);

  */

  // /^[A-Za-zÀ-ú0-9\s\.()',-]{1,65}$/

  // firstName, lastName

  // Alberto Preciado, MD
  // Alberto Preciado, Ph.D., biology
  // Odell Grooms '78B
  // Cooper-Smith
  // Sasha (Massand) '01 and Dan Moen '04
  // Jane Smith (biology)

}

function titleCheck() {

    /*

    A-Z
    a-z
    À-ú (accents)
    0-9
    \s (whitespace)
    \. (period)
    \/ (slash)
    +
    #
    :
    ()
    '
    "
    ,
    &
    -
    {2-80} chars
    
  */


  // /^[A-Za-zÀ-ú0-9\s\.\/+#:()'",&-]{2,80}$/
  // title

  // Vice President for Marketing and External Relations Rick Sweeney
  // Quality Control Coordinator
  // UX Designer & UI Developer
  // Help Desk Worker/Desktop Support
  // Chief Technology Officer (CTO)
  // Front-Line Employee
  // Women’s Shelter Jobs
  // Teaching, Training & Education
  // C# Developer
  // C++ Developer
  // .NET Developer
  // Software Developer (Back-End: JavaScript-React/Firebase)
  // Top "Avocado" Associate


}


function summaryCheck() {
  /*

    A-Z
    a-z
    À-ú (accents)
    0-9
    \s (whitespace)
    \. (period)
    \/ (slash)
    +
    #
    :
    ()
    '
    "
    ,
    &
    @
    !
    -
    {2-280} chars



    others
    ~
    _
    ^
    |
    \


    prob not
    <>
    =
    *
    %
    ?
    $
    ;

    
  */


  // /^[A-Za-zÀ-ú0-9\s\.\/+#:()'",&@!-]{2,280}$/
  // summary
  
}


function githubCheck(input) {
  // github usernames can contain '-' (not at beginning or end)
  // github international URLs contain sub domain(de.github.com)


  // URL
  // /^(?:https?:\/\/)?(?:www\.)?[\.a-z]{1,7}?github\.com\/(?!-)([A-Za-z0-9-]+)(?<!-)\/?$/
  // carrot and money sign for start/end
  // (?:https?:\/\/)?
    // optional 'https//:' with optional 's' in http
  // (?:www\.)?
    // optional 'www.'
  // [\.a-z]{1,7}
    // optional preUrl for international URLS
  // github\.com\/
    // matching 'github.com/'
  // (?!-)
    // no hyphen allowed at start of username
  // ([A-Za-z0-9-]+)
  // no space, matching a-z, A-Z, 0-9, -(not at start/end)
  // capturing group to seperate url from username
  // (?<!-)
    // no hyphen allowed at end of username
  // \/?
    // optional / at end, not grouped
  // 


  // USER
  // /^(?!-)[A-Za-z0-9-]+(?<!-)$/
  // carrot and money sign for start/end
  // (?!-)
    // no hyphen allowed at start of username
  // [A-Za-z0-9-]+
  // no space, matching a-z, A-Z, 0-9, -(not at start/end)
  // no capturing group needed
  // (?<!-)
    // no hyphen allowed at end of username
  //


  const githubRegExUrl = /^(?:https?:\/\/)?(?:www\.)?[\.a-z]{1,7}?github\.com\/(?!-)([A-Za-z0-9-]+)(?<!-)\/?$/
  const githubRegExUser = /^(?!-)[A-Za-z0-9-]+(?<!-)$/

  const githubUrlFound = input.match(githubRegExUrl)
  const githubUserFound = input.match(githubRegExUser)

  if (githubUrlFound && githubUrlFound[1]) {
    console.log("G URL FOUND")
    console.log(githubUrlFound[1])
    return githubUrlFound[1]
  } else if (githubUserFound && githubUserFound[0]) {
    console.log("G USER FOUND")
    console.log(githubUserFound[0])
    return githubUserFound[0]
  } else {
    console.log("NOT FOUND")
    return false
  }
}

function linkedinCheck(input) {
  // linkedin usernames can contain '-' (anywhere)
  // linkedin international URLs contain sub domain(de.linkedin.com)


  // URL
  // /^(?:https?:\/\/)?(?:www\.)?[\.a-z]{1,7}?linkedin\.com\/in\/([A-Za-z0-9-]+)\/?$/
  // carrot and money sign for start/end
  // (?:https?:\/\/)?
    // optional 'https//:' with optional 's' in http
  // (?:www\.)?
    // optional 'www.'
  // [\.a-z]{1,7}
    // optional preUrl for international URLS
  // linkedin\.com\/in\/
    // matching linkedin.com/in/
  // ([A-Za-z0-9-]+)
    // no space, matching a-z, A-Z, 0-9, -(anywhere)
    // capturing group to seperate url from username
  // \/?
    // optional / at end, not grouped
  // 

  // USER
  // /^[A-Za-z0-9-]+$/
  // carrot and money sign for start/end
  // [A-Za-z0-9-]
    // no space, matching a-z, A-Z, 0-9, -(anywhere)
    // no capturing group needed


  const linkedinRegExUrl = /^(?:https?:\/\/)?(?:www\.)?[\.a-z]{1,7}?linkedin\.com\/in\/([A-Za-z0-9-]+)\/?$/
  const linkedinRegExUser = /^[A-Za-z0-9-]+$/

  const linkedinUrlFound = input.match(linkedinRegExUrl)
  const linkedinUserFound = input.match(linkedinRegExUser)

  if (linkedinUrlFound && linkedinUrlFound[1]) {
    console.log("L URL FOUND")
    console.log(linkedinUrlFound[1])
    return linkedinUrlFound[1]
  } else if (linkedinUserFound && linkedinUserFound[0]) {
    console.log("L USER FOUND")
    console.log(linkedinUserFound[0])
    return linkedinUserFound[0]
  } else {
    console.log('NOT FOUND')
    return false
  }
}

function twitterCheck(input) {
  // twiter username should match A-z, 0-9, _(anywhere)
  // unsure how international URL look with twitter
  // leaving start/end, sub-domains will not be allowed

  // URL
  // /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:@?)([A-Za-z0-9_]+)\/?$/
  // carrot and money sign for start/end
  // (?:https?:\/\/)?
    // optional 'https//:' with optional 's' in http
  // (?:www\.)?
    // optional 'www.'
  // twitter\.com\/
    // matching 'twitter.com/'
  // (?:@?)
    // optional @
  // ([A-Za-z0-9_]+)
  // no space, matching a-z, A-Z, 0-9, _
  // capturing group to seperate url from username
  // \/?
    // optional / at end, not grouped
  //

  // USER
  // /^(?:@?)([A-Za-z0-9_]+$)/
  // carrot and money sign for start/end
  // ^(?:@?)
    // optional @
  // ([A-Za-z0-9_]+$)
    // no space, matching a-z, A-Z, 0-9, _(anywhere)
    // capturing group to seperate '@' if used
  //


  const twitterRegExUrl = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:@?)([A-Za-z0-9_]+)\/?$/
  const twitterRegExUser = /^(?:@?)([A-Za-z0-9_]+$)/

  const twitterUrlFound = input.match(twitterRegExUrl)
  const twitterUserFound = input.match(twitterRegExUser)

  if (twitterUrlFound && twitterUrlFound[1]) {
    console.log("T URL FOUND")
    console.log(twitterUrlFound[1])
  } else if (twitterUserFound && twitterUserFound[1]) {
    console.log("T USER FOUND")
    console.log(twitterUserFound[1])
  } else {
    console.log('NOT FOUND')
  }
}

function urlCheck() {

}
