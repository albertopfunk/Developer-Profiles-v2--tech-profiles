export function validateInput(type, value) {
  switch (type) {
    case "name":
      return nameCheck(value);
    case "email":
      return emailCheck(value);
    case "title":
      return titleCheck(value);
    case "summary":
      return summaryCheck(value);
    case "github":
      return githubCheck(value);
    case "linkedin":
      return linkedinCheck(value);
    case "twitter":
      return twitterCheck(value);
    case "url":
      return urlCheck(value);
    default:
      return false;
  }
}

function nameCheck(value) {
  /*
    Rules

    Allowed: A-Z, a-z, À-ú(accents), 0-9, whitespace, periods, parentheses,
    apostrophes, commas, hyphens/dashes

    length: 1-65 chars
  */

  const regex = /^[A-Za-zÀ-ú0-9\s\.()',-]{1,65}$/;
  console.log(regex.test(value));
  return regex.test(value);
}

function emailCheck(value) {
  /*
    Rules

    Structure: local @ domain . TLD

    local
    Allowed: A-Z, a-z, À-ú(accents), 0-9, periods, underscores, plus signs, hyphens/dashes
    Not Allowed: special characters at start/end
    Length: 1-64 chars

    @ sign required

    domain
    1-8 domains seperated by period
    Allowed: A-Z, a-z, À-ú(accents), 0-9, hyphens/dashes
    Length: 1-63 chars

    TLD
    Allowed: A-Z, a-z, À-ú(accents)
    Length: 2-63 chars
  */

  const regex = /^(?!\.|_|\+|-)[A-Za-zÀ-ú0-9._+-]{1,64}(?<!\.|_|\+|-)@(?:[A-Za-zÀ-ú0-9-]{1,63}\.){1,8}[A-Za-zÀ-ú]{2,63}$/;
  console.log(regex.test(value));
  return regex.test(value);
}

function titleCheck(value) {
  /*
    Rules

    Allowed: A-Z, a-z, À-ú(accents), 0-9, whitespace, periods, slashes, plus signs,
    number/hash signs, colons, parentheses, apostrophes, quotation marks, commas,
    ampersands, hyphens/dashes

    length: 2-80 chars
  */

  const regex = /^[A-Za-zÀ-ú0-9\s\.\/+#:()'",&-]{2,80}$/;
  console.log(regex.test(value));
  return regex.test(value);
}

function summaryCheck(value) {
  /*
    Rules

    Allowed: A-Z, a-z, À-ú(accents), 0-9, whitespace, periods, slashes, plus signs,
    number/hash signs, colons, parentheses, apostrophes, quotation marks, commas,
    ampersands, at sign, exclamation mark, underscores, hyphens/dashes
    
    length: 2-280 chars
    
    Unsure: ~, ^, |, \, <>, =, *, %, ?, $, ;
  */

  const regex = /^[A-Za-zÀ-ú0-9\s\.\/+#:()'",&@!_-]{2,280}$/;
  console.log(regex.test(value));
  return regex.test(value);
}

function githubCheck(value) {
  /*
    Rules

    Structure: protocol:// www. international. github.com/ username /
    github usernames can contain hyphens/dashes but not at beginning or end
    github international URLs contain a sub domain(de.github.com)

    protocol
    optional http(s)://

    subdomain
    optional www.

    international subdomain
    github supports international subdomain URLs
    1 subdomain seperated by period
    Allowed: a-z
    Length: 1-7 chars

    domain
    required github.com/

    username
    Allowed: A-Z, a-z, 0-9, hyphens/dashes
    Not Allowed: hyphens/dashes at start/end

    optional slash at end of URL

    with negative lookahead/behind
    ^(?:https?:\/\/)?(?:www\.)?(?:[a-z]{1,7}\.)?github\.com\/(?!-)([A-Za-z0-9-]+)(?<!-)\/?$
    ^(?!-)[A-Za-z0-9-]+(?<!-)$

    without negative lookahead/behind
    ^(?:https?:\/\/)?(?:www\.)?(?:[a-z]{1,7}\.)?github\.com\/([A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9])\/?$
    ^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$
  */

  const githubRegExUrl = /^(?:https?:\/\/)?(?:www\.)?(?:[a-z]{1,7}\.)?github\.com\/([A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9])\/?$/;
  const githubRegExUser = /^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$/;

  const githubUrlFound = value.match(githubRegExUrl);
  const githubUserFound = value.match(githubRegExUser);

  if (githubUrlFound && githubUrlFound[1]) {
    console.log("url found");
    console.log(githubUrlFound[1]);
    return githubUrlFound[1];
  } else if (githubUserFound && githubUserFound[0]) {
    console.log("user found");
    console.log(githubUserFound[0]);
    return githubUserFound[0];
  } else {
    console.log("not found");
    return false;
  }
}

function linkedinCheck(value) {
  /*
    Rules

    Structure: protocol:// www. international. linkedin.com/in/ username /
    linkedin usernames can contain hyphens/dashes anywhere
    linkedin international URLs contain a sub domain(de.linkedin.com)

    protocol
    optional http(s)://

    subdomain
    optional www.

    international subdomain
    linkedin supports international subdomain URLs
    1 subdomain seperated by period
    Allowed: a-z
    Length: 1-7 chars

    domain
    required linkedin.com/in/

    username
    Allowed: A-Z, a-z, 0-9, hyphens/dashes

    optional slash at end of URL
  */

  const linkedinRegExUrl = /^(?:https?:\/\/)?(?:www\.)?(?:[a-z]{1,7}\.)?linkedin\.com\/in\/([A-Za-z0-9-]+)\/?$/;
  const linkedinRegExUser = /^[A-Za-z0-9-]+$/;

  const linkedinUrlFound = value.match(linkedinRegExUrl);
  const linkedinUserFound = value.match(linkedinRegExUser);

  if (linkedinUrlFound && linkedinUrlFound[1]) {
    console.log("url found");
    console.log(linkedinUrlFound[1]);
    return linkedinUrlFound[1];
  } else if (linkedinUserFound && linkedinUserFound[0]) {
    console.log("user found");
    console.log(linkedinUserFound[0]);
    return linkedinUserFound[0];
  } else {
    console.log("not found");
    return false;
  }
}

function twitterCheck(value) {
  /*
    Rules

    Structure: protocol:// www. twitter.com/ @ username /
    twitter usernames can contain underscores anywhere
    unsure if twitter supports international subdomains, not allowing for now

    protocol
    optional http(s)://

    subdomain
    optional www.

    domain
    required twitter.com/

    optional @

    username
    Allowed: A-Z, a-z, 0-9, underscores

    optional slash at end of URL
  */

  const twitterRegExUrl = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:@)?([A-Za-z0-9_]+)\/?$/;
  const twitterRegExUser = /^(?:@?)([A-Za-z0-9_]+$)/;

  const twitterUrlFound = value.match(twitterRegExUrl);
  const twitterUserFound = value.match(twitterRegExUser);

  if (twitterUrlFound && twitterUrlFound[1]) {
    console.log("url found");
    console.log(twitterUrlFound[1]);
  } else if (twitterUserFound && twitterUserFound[1]) {
    console.log("user found");
    console.log(twitterUserFound[1]);
  } else {
    console.log("not found");
    return false;
  }
}

function urlCheck(value) {
  /*
    Rules

    Structure: protocol:// www. domain-name . TLD / path

    protocol
    optional http(s)://

    subdomain
    optional www.

    domain
    1-8 domains seperated by period
    Allowed: A-Z, a-z, À-ú(accents), 0-9, hyphens/dashes
    Not Allowed: hyphens/dashes at start/end
    Length: 1-63 chars

    TLD
    Allowed: A-Z, a-z, À-ú(accents)
    Length: 2-63 chars



    optional path with conditional
    allows for paths IF first path starts with a slash after TLD
    unlimited amount of paths/queries allowed
    Allowed: A-Z, a-z, À-ú(accents), 0-9, hyphens/dashes, periods, underscores,
    number/hash signs, question marks, equal signs, plus signs, ampersands,
    percent signs, slashes

    Unsure: ;, :, @, $, !, *, ,, (), '

    with conditional and negative lookahead/behind, unnamed and named group respectively
    /^(?:https?:\/\/)?(?:www\.)?(?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(\/)?(?(1)(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)$/
    /^(?:https?:\/\/)?(?:www\.)?(?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(?<path>\/)?(?(path)(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)$/

    with 'or' operator and negative lookahead/behind
    ^(?:https?:\/\/)?(?:www\.)?(?:(?!-)[A-Za-zÀ-ú0-9-]{1,63}(?<!-)\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(?:(?:\/(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)|\/?)$

    with 'or' operator
    ^(?:https?:\/\/)?(?:www\.)?(?:[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9-]{1,63}[A-Za-zÀ-ú0-9]\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(?:(?:\/(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)|\/?)$
  */

  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9-]{1,63}[A-Za-zÀ-ú0-9]\.){1,8}(?:[A-Za-zÀ-ú]{2,63})(?:(?:\/(?:[A-Za-zÀ-ú0-9-._#?=+&%\/])*)|\/?)$/;
  console.log(regex.test(value));
  return regex.test(value);
}
