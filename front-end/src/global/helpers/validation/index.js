
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

function emailCheck() {

  /*
    https://www.regular-expressions.info/email.html
    A-Z
    a-z
    À-ú (accents)
    0-9
  
  */


  // examples
  // /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
  // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
  // /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/
  // /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


  // mines
  // /^(?!\.|_|\+|-)[A-Za-zÀ-ú0-9._+-]{1,64}(?<!\.|_|\+|-)@(?:[A-Za-zÀ-ú0-9-]{1,63}\.){1,8}[A-Za-zÀ-ú]{2,63}$/
  // carrot and money sign for start/end
  // (?!\.|_|\+|-)
    // negative lookahead, ensures start does not include . or _ or + or -
  // [A-Za-zÀ-ú0-9._+-]{1,64}
    // first part of email, local
    // alphanumeric characters allows, along with ._+-
    // max length for local part, 64chars
  // (?<!\.|_|\+|-)
    // negative lookbehind, ensures end does not include . or _ or + or -
  // @
    // required
  // (?:[A-Za-zÀ-ú0-9-]{1,63}\.){1,8}
    // second part is the domain name
    // this non capturing whole group can repeat itself 8 times
    // this handles cases with multiple domains(john@server.department.company.com)
    // the group consists of alphanumeric characters and -
    // max length for group is 63 characters for each repeat
  // [A-Za-zÀ-ú]{2,63}
    // third part is the TLD
    // TLDs should only be alphabetical characters
    // 63 is the max since new TLDs can be longer
  // 


  // albertopfunk@gmail.com
  // fabio@disapproved.solutions
  // john@server.department.company.com
  // test+mysite@a.com
  // address.test@example.com
  // multiple@domain.parts.co.uk
  // my.ownsite@ourearth.org
  // johnDoe899@hotmail.co.uk
  // clifford.douglas.chi@domain.com
  // clifford+douglas-chi@domain.com

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
  /*

    URL Structure
    protocol://domain-name.top-level-domain/path

    The URL Path must be either http://host/path or https://host/path

    
    URL
    /^(?:https?:\/\/)?(?:www\.)?(?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(\/)?(?(1)(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)\/?$/

  
    optional http(s)//:
    (?:https?:\/\/)?



    optional www.
    (?:www\.)?



    domain
    cannot start or end with any special chars
    can have up to 8 domains each 1-63chars
    (?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}
    
    
    TLD(.com, .co.uk, .something.else)
    no special chars
    (?:[A-Za-zÀ-ú]{2,63})



    options after TLD(.com/some/path?query=other-stuff)
    selected special chars allowed
    slash(/) required, if it is present, then it will signify URL has a path
    conditional, only checks pattern if URL has path, represented by a slash(/)
    pattern can repeat as many times as needed
    (\/)?(?(1)(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)
    curr chars == -._#?=+&%\/
    poss chars == ;:@ $!*,()'


    optional / at end
    \/?

  */




  // /^(?:https?:\/\/)?(?:www\.)?(?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(\/)?(?(1)(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)\/?$/




  // https://www.google.co.uk/hello-there
  // https://www.google.co.uk/hello-there/fdr?query=hellomon
  // https://www.google.com/hello-there
  // https://www.google.com/hello-there/new
  // https://www.google.com/v1/hello-there/new
  // https://www.google.com/v1/hello-there
  // https://www.google.com/
  // https://www.google.com
  // http://www.google.com/
  // http://www.google.com
  // https://google.com
  // http://google.com/
  // www.google.com
  // google.com/
  // google.com
  // www.sample.com/xyz/#/xyz
  // https://domain.site.com
  // https://www.site.com/path/to/dir/
  // https://www.domain.domain.site.com/path/to/dir/
  // http://www.site.com/path/to/file.html
  // https://www.site.com/path/to/file.html
  // http://site.com/path/to/file.html
  // https://site.com/path/to/file.html
  // http://domain.site.com/path/to/file.html
  // https://domain.site.com/path/to/file.html
  // http://www.domain.site.com/path/to/file.html
  // https://www.domain.domain.site.com/path/to/file.html
  // https://www.example.com/foo/?bar=baz&inga=42&quux
  // http://foo.bar/?q=Test%20URL-encoded%20stuff
  // https://www.foufos.gr
  // https://en.wikipedia.org/wiki/Domain_name
  // https://sourceforge.net/directory/business-enterprise/os:mac/
  // https://www.computerhope.com/cgi-bin/search.cgi?q=example%20search
  // http://www.example.com/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument
  // https://en.wikipedia.org/wiki/Internet#Terminology
  // http://www.example.com/%E4%B8%AD%E6%96%87%/E5%8C%97%E4%BA%AC%5Bcity%5D
  // http://example.com/kb/index.php?cat=8&id=41
  // http://www.example.com/10395embislgm-potllz1.php

  


  // no
  // //developer.mozilla.org/en-US/docs/Learn
  // ./developer.mozilla.org/en-US/docs/Learn
  // http://ftp://random.vib.slx/
  // http://www.example.com:80/path/to/myfile.html
  // https://google.us.edi?34535/534534?dfg=g&fg/
  // http://localhost:8080/myfbsampleapp
  // example.com/file[/].html
  // http://mw1.google.com/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg
  // http://api.google.com/q?exp=a|b
  // http:www.example.com/main.html
  // http://www.example.com/grave`accent


}
