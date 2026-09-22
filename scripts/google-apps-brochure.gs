/**
 * Industron brochure leads + one-click sales approval → PDF emailed FROM sales@.
 *
 * SETUP — pick ONE so mail is From: sales@industronnano.com:
 *
 *   A) BEST: create/run this Web App while logged in as sales@industronnano.com
 *      (share the 3 Drive PDFs with sales@ as Viewer or Editor)
 *
 *   B) Keep script on nanoyantrika@gmail.com:
 *      Gmail → Settings → See all settings → Accounts → “Send mail as”
 *      → Add another email address → sales@industronnano.com → verify
 *      Then GmailApp can send From: sales@
 *
 * Shared steps:
 * 1. Paste Drive links in BROCHURE_BY_SLUG; set APPROVE_SECRET + WEB_APP_URL
 * 2. Show appsscript.json → use scripts/appsscript-brochure.json
 * 3. Run runOnceAuthorizeDrive → Allow (Drive + Gmail)
 * 4. Optional: Run runOnceCheckSendAs → Logs must list sales@industronnano.com
 * 5. Deploy → Web app → Me / Anyone → New version
 * 6. .env: VITE_BROCHURE_SCRIPT_URL=<same /exec URL>
 */

var SALES_EMAIL = 'sales@industronnano.com'
var OWNER_BCC = 'nanoyantrika@gmail.com'
var FROM_LABEL = 'Industron'
var SCRIPT_VERSION = 13

/** Change this to a private random string, then redeploy. */
var APPROVE_SECRET = 'industron-brochure-approve-change-me-2026'

/**
 * REQUIRED: paste the Web App URL that ends in /exec (not /dev, not a Library URL).
 * Deploy → Manage deployments → copy Web app URL.
 * Example: https://script.google.com/macros/s/AKfycb.../exec
 */
var WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbzMYsyqapsG2ZpzQRmsl6ABW80z6Q8iCFQPL60FdIDMp3cbU9c-XkOIV8rEtnjEVGbi/exec'

/** Optional fallback if Drive link/file is missing (live site public PDFs). */
var SITE_BASE = 'https://www.industronnano.com'

/**
 * Paste Google Drive share links (or raw file IDs) into `drive` for each product.
 * Examples:
 *   'https://drive.google.com/file/d/1AbC...xyz/view?usp=sharing'
 *   'https://drive.google.com/open?id=1AbC...xyz'
 *   '1AbC...xyz'
 */
var BROCHURE_BY_SLUG = {
  mesoprobe: {
    file: 'Mesoprobe.pdf',
    label: 'MesoProbe',
    drive: 'https://drive.google.com/file/d/1VQot5w5CQWLRLcss62yKscKXTdpWBwOh/view?usp=sharing',
  },
  'uprobe-500': {
    file: 'Muprobe.pdf',
    label: 'μProbe 500',
    drive: 'https://drive.google.com/file/d/13PyxG1r4pgsbZiY-JnmTwsnp_6X39yZC/view?usp=drive_link',
  },
  ng80: {
    file: 'NG80.pdf',
    label: 'NG80',
    drive: 'https://drive.google.com/file/d/18g7YEjYIdB4X-gV58QMR6p70Y6Z8HOyD/view?usp=drive_link',
  },
}

function doGet(e) {
  var data = (e && e.parameter) || {}

  if (data.action === 'approve') {
    return handleApprove_(data)
  }

  if (!data.email && !data.Email && !data.name && !data.Name) {
    return jsonResponse_({
      ok: true,
      service: 'Industron brochure leads',
      notify: SALES_EMAIL,
      version: SCRIPT_VERSION,
      approve: true,
      webAppConfigured: !!String(WEB_APP_URL || '').trim(),
    })
  }

  try {
    sendLeadEmailToSales_(data)
    return jsonResponse_({ ok: true, version: SCRIPT_VERSION, sentTo: SALES_EMAIL })
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err), version: SCRIPT_VERSION })
  }
}

function doPost(e) {
  try {
    var data = {}
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents)
    } else if (e.parameter) {
      data = e.parameter
    }
    sendLeadEmailToSales_(data)
    return jsonResponse_({ ok: true, version: SCRIPT_VERSION })
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err), version: SCRIPT_VERSION })
  }
}

function getWebAppUrl_() {
  var configured = String(WEB_APP_URL || '').trim()
  if (configured) return normalizeExecUrl_(configured)
  var fromService = ''
  try {
    fromService = ScriptApp.getService().getUrl() || ''
  } catch (err) {}
  return normalizeExecUrl_(fromService)
}

/** Strip /u/N/ multi-account junk; always use /macros/s/.../exec */
function normalizeExecUrl_(url) {
  var s = String(url || '')
    .trim()
    .replace(/\/$/, '')
  s = s.replace(/\/macros\/u\/\d+\//, '/macros/')
  return s
}

function sendLeadEmailToSales_(data) {
  var lead = normalizeLead_(data)
  if (!lead.email) throw new Error('Missing lead email')

  var base = getWebAppUrl_()
  if (!base || base.indexOf('/exec') === -1) {
    throw new Error(
      'WEB_APP_URL is missing or not an /exec Web App URL. ' +
        'Open Deploy → Manage deployments, copy the URL ending in /exec, paste into WEB_APP_URL, redeploy.',
    )
  }

  var token = makeToken_(lead.email, lead.productSlug)
  // Keep Approve URL short so Gmail does not break the link.
  var approveUrl =
    base +
    '?action=approve' +
    '&email=' +
    encodeURIComponent(lead.email) +
    '&name=' +
    encodeURIComponent(lead.name) +
    '&productSlug=' +
    encodeURIComponent(lead.productSlug) +
    '&token=' +
    encodeURIComponent(token)

  var subject = '[Brochure Request] ' + lead.product + (lead.name ? ' — ' + lead.name : '')

  var textBody = [
    'New brochure request',
    '',
    'Name: ' + lead.name,
    'Organization: ' + lead.organization,
    'Email: ' + lead.email,
    'Phone: ' + lead.phone,
    'Requirement: ' + lead.requirementType,
    'Product: ' + lead.product,
    'Slug: ' + lead.productSlug,
    '',
    'Approve & send brochure automatically:',
    approveUrl,
    '',
    'If you see a Google Drive “unable to open the file” error, open the same link in an Incognito/Private window (or while signed into the Google account that owns the Apps Script). Multi-account Google sessions break /u/N/ script URLs.',
  ].join('\n')

  var htmlBody = [
    '<p><b>New brochure request</b></p>',
    '<p>',
    'Name: ' + esc_(lead.name) + '<br>',
    'Organization: ' + esc_(lead.organization) + '<br>',
    'Email: ' + esc_(lead.email) + '<br>',
    'Phone: ' + esc_(lead.phone) + '<br>',
    'Requirement: ' + esc_(lead.requirementType) + '<br>',
    'Product: ' + esc_(lead.product) + '<br>',
    'Slug: ' + esc_(lead.productSlug),
    '</p>',
    '<p><a href="' + approveUrl + '" ',
    'style="display:inline-block;padding:12px 18px;background:#1d4ed8;color:#fff;',
    'text-decoration:none;border-radius:8px;font-weight:700;">',
    'Approve &amp; send brochure</a></p>',
    '<p style="color:#64748b;font-size:12px;">Or open this link:<br>' + esc_(approveUrl) + '</p>',
    '<p style="color:#b45309;font-size:12px;"><b>Tip:</b> If you get a Drive “unable to open the file” page, ',
    'open the link in an <b>Incognito/Private</b> window. That happens when Google rewrites the URL to ',
    '<code>/macros/u/5/...</code> for the wrong signed-in account.</p>',
  ].join('')

  MailApp.sendEmail({
    to: SALES_EMAIL,
    bcc: OWNER_BCC,
    subject: subject,
    body: textBody,
    htmlBody: htmlBody,
    name: FROM_LABEL + ' Brochure Leads',
    replyTo: lead.email,
  })
}

function handleApprove_(data) {
  var lead = normalizeLead_(data)
  var token = data.token || ''

  if (!lead.email || !lead.productSlug) {
    return htmlPage_('Missing data', 'This approve link is incomplete. Ask the lead to submit again.', false)
  }
  if (!checkToken_(lead.email, lead.productSlug, token)) {
    return htmlPage_(
      'Invalid link',
      'This approve link is invalid or expired (secret changed, or old email). Ask the lead to submit again.',
      false,
    )
  }

  var meta = BROCHURE_BY_SLUG[lead.productSlug]
  if (!meta) {
    return htmlPage_(
      'No PDF mapped',
      'No brochure file is configured for “' +
        esc_(lead.product || lead.productSlug) +
        '”. Email the lead manually: ' +
        esc_(lead.email),
      false,
    )
  }

  try {
    var blob = getBrochureBlob_(meta)

    var subjectLead = meta.label + ' brochure — Industron'
    var bodyLead = [
      'Hello' + (lead.name ? ' ' + lead.name : '') + ',',
      '',
      'Thank you for your interest in Industron.',
      'Please find the ' + meta.label + ' brochure attached.',
      '',
      'If you have questions, reply to this email or contact ' + SALES_EMAIL + '.',
      '',
      '— Industron Sales',
    ].join('\n')
    var htmlLead = [
      '<p>Hello' + (lead.name ? ' ' + esc_(lead.name) : '') + ',</p>',
      '<p>Thank you for your interest in Industron.</p>',
      '<p>Please find the <b>' + esc_(meta.label) + '</b> brochure attached.</p>',
      '<p>Questions? Reply to this email or write to <a href="mailto:' + SALES_EMAIL + '">' + SALES_EMAIL + '</a>.</p>',
      '<p>— Industron Sales</p>',
    ].join('')

    sendAsSales_({
      to: lead.email,
      subject: subjectLead,
      body: bodyLead,
      htmlBody: htmlLead,
      attachments: [blob],
    })

    MailApp.sendEmail({
      to: SALES_EMAIL,
      bcc: OWNER_BCC,
      subject: '[Brochure Sent] ' + meta.label + ' → ' + lead.email,
      body:
        'Approved: brochure PDF was emailed FROM ' +
        SALES_EMAIL +
        ' to ' +
        lead.email +
        ' for product ' +
        meta.label +
        '.\n\nIf the lead got nothing, check Spam/Promotions. ' +
        'A BCC copy went to ' +
        OWNER_BCC +
        '.',
      name: FROM_LABEL + ' Brochure Leads',
    })

    return htmlPage_(
      'Brochure sent',
      'The <b>' +
        esc_(meta.label) +
        '</b> PDF was emailed to <b>' +
        esc_(lead.email) +
        '</b> from <b>' +
        esc_(SALES_EMAIL) +
        '</b>.<br><br>' +
        'Ask them to check Inbox + Spam. A BCC copy also went to <b>' +
        esc_(OWNER_BCC) +
        '</b>.',
      true,
    )
  } catch (err) {
    return htmlPage_('Send failed', esc_(String(err)), false)
  }
}

/**
 * RUN ONCE: select this function → Run.
 * When Google says the app isn’t verified: Advanced → Go to … (unsafe) → Allow.
 * You must allow Drive access or attachments will fail.
 */
function runOnceAuthorizeDrive() {
  DriveApp.getRootFolder()
  var id = extractDriveFileId_(BROCHURE_BY_SLUG.mesoprobe.drive)
  var blob = DriveApp.getFileById(id).getBlob()
  Logger.log('Drive OK: ' + blob.getName() + ' (' + blob.getBytes().length + ' bytes)')
}

/** TEST: loads all three brochures via DriveApp. */
function runOnceTestDriveLinks() {
  var keys = Object.keys(BROCHURE_BY_SLUG)
  for (var i = 0; i < keys.length; i++) {
    var meta = BROCHURE_BY_SLUG[keys[i]]
    var blob = getBrochureBlob_(meta)
    Logger.log(meta.label + ': OK ' + blob.getBytes().length + ' bytes')
  }
}

/**
 * Load PDF with DriveApp (script owner). UrlFetch fallback is unreliable for Drive.
 */
function getBrochureBlob_(meta) {
  var driveId = extractDriveFileId_(meta.drive)

  if (driveId) {
    try {
      return DriveApp.getFileById(driveId).getBlob().setName(meta.file)
    } catch (err) {
      var viaLink = fetchDriveBlobByUrl_(driveId, meta.file)
      if (viaLink) return viaLink
      throw new Error(
        'DriveApp blocked for “' +
          meta.label +
          '”. Run runOnceAuthorizeDrive, click Advanced → Go to project → Allow (Drive). ' +
          'Also confirm appsscript.json includes drive.readonly. Detail: ' +
          String(err),
      )
    }
  }

  var pdfUrl = SITE_BASE + '/Brochure/' + meta.file
  var resp = UrlFetchApp.fetch(pdfUrl, { muteHttpExceptions: true, followRedirects: true })
  if (resp.getResponseCode() < 200 || resp.getResponseCode() >= 300) {
    throw new Error('No Drive id for “' + meta.label + '” and site PDF missing.')
  }
  return resp.getBlob().setName(meta.file)
}

/**
 * Download via Drive share link (Anyone with the link).
 * Prefer drive.usercontent.google.com — Google no longer serves PDFs from uc? alone.
 */
function fetchDriveBlobByUrl_(fileId, fileName) {
  var urls = [
    'https://drive.usercontent.google.com/download?id=' +
      encodeURIComponent(fileId) +
      '&export=download&confirm=t',
    'https://drive.usercontent.google.com/download?id=' +
      encodeURIComponent(fileId) +
      '&export=download',
    'https://drive.google.com/uc?export=download&confirm=t&id=' + encodeURIComponent(fileId),
    'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(fileId),
  ]

  var lastHint = ''
  for (var i = 0; i < urls.length; i++) {
    try {
      var result = tryFetchPdf_(urls[i], fileId, fileName)
      if (result.blob) return result.blob
      if (result.hint) lastHint = result.hint
    } catch (err) {
      lastHint = String(err)
    }
  }
  if (lastHint) Logger.log('Drive download failed: ' + lastHint)
  return null
}

function tryFetchPdf_(url, fileId, fileName) {
  var resp = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  var code = resp.getResponseCode()
  var contentType = String(
    resp.getHeaders()['Content-Type'] || resp.getHeaders()['content-type'] || '',
  ).toLowerCase()
  var blob = resp.getBlob()
  var bytes = blob.getBytes()

  // Virus-scan / confirm HTML interstitial
  if (contentType.indexOf('text/html') !== -1) {
    var html = resp.getContentText()
    var m = html.match(/confirm=([0-9A-Za-z_]+)/)
    if (!m) m = html.match(/name="confirm"\s+value="([^"]+)"/)
    if (!m) m = html.match(/&amp;confirm=([0-9A-Za-z_]+)/)
    if (m) {
      var confirmUrl =
        'https://drive.usercontent.google.com/download?id=' +
        encodeURIComponent(fileId) +
        '&export=download&confirm=' +
        encodeURIComponent(m[1])
      resp = UrlFetchApp.fetch(confirmUrl, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })
      code = resp.getResponseCode()
      contentType = String(
        resp.getHeaders()['Content-Type'] || resp.getHeaders()['content-type'] || '',
      ).toLowerCase()
      blob = resp.getBlob()
      bytes = blob.getBytes()
    }
  }

  if (code < 200 || code >= 300) {
    return { blob: null, hint: 'HTTP ' + code + ' from ' + url }
  }
  if (!bytes || bytes.length < 100) {
    return { blob: null, hint: 'empty body from ' + url }
  }
  if (contentType.indexOf('text/html') !== -1) {
    return { blob: null, hint: 'got HTML (file may still be Restricted) from ' + url }
  }

  // %PDF magic (mask for signed Java bytes in Apps Script)
  var b0 = bytes[0] & 0xff
  var b1 = bytes[1] & 0xff
  var b2 = bytes[2] & 0xff
  var b3 = bytes[3] & 0xff
  var isPdfMagic = b0 === 0x25 && b1 === 0x50 && b2 === 0x44 && b3 === 0x46
  var isPdfType =
    contentType.indexOf('pdf') !== -1 || contentType.indexOf('octet-stream') !== -1 || contentType.indexOf('application/binary') !== -1

  if (!isPdfMagic && !(isPdfType && bytes.length > 1000)) {
    return {
      blob: null,
      hint: 'not a PDF (type=' + contentType + ', size=' + bytes.length + ') from ' + url,
    }
  }

  return { blob: blob.setName(fileName), hint: '' }
}

/** Accepts full Drive URLs or a bare file ID. */
function extractDriveFileId_(value) {
  var s = String(value || '').trim()
  if (!s) return ''

  var m = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return m[1]

  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (m) return m[1]

  m = s.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return m[1]

  if (/^[a-zA-Z0-9_-]{20,}$/.test(s)) return s

  return ''
}

/**
 * RUN ONCE after adding sales@ as “Send mail as” (or when script runs as sales@).
 * Logs must include sales@industronnano.com — otherwise From: sales@ will fail.
 */
function runOnceCheckSendAs() {
  var aliases = GmailApp.getAliases()
  Logger.log('Account aliases: ' + JSON.stringify(aliases))
  Logger.log('Script will try From: ' + SALES_EMAIL)
  var ok = false
  for (var i = 0; i < aliases.length; i++) {
    if (String(aliases[i]).toLowerCase() === SALES_EMAIL.toLowerCase()) ok = true
  }
  // Also OK if the script itself is running as sales@
  try {
    var me = Session.getActiveUser().getEmail()
    Logger.log('Active user: ' + me)
    if (String(me).toLowerCase() === SALES_EMAIL.toLowerCase()) ok = true
  } catch (err) {}
  if (!ok) {
    throw new Error(
      'sales@ is not available as From. Either run this script as sales@, or in the ' +
        'script owner Gmail add Send mail as → ' +
        SALES_EMAIL,
    )
  }
  Logger.log('OK — can send as ' + SALES_EMAIL)
}

/**
 * Send brochure FROM sales@ after Approve.
 * Requires: script owned by sales@, OR sales@ added under Gmail “Send mail as”.
 */
function sendAsSales_(opts) {
  try {
    GmailApp.sendEmail(opts.to, opts.subject, opts.body, {
      htmlBody: opts.htmlBody,
      attachments: opts.attachments || [],
      name: 'Industron Sales',
      replyTo: SALES_EMAIL,
      bcc: OWNER_BCC,
      from: SALES_EMAIL,
    })
  } catch (err) {
    throw new Error(
      'Could not send From: ' +
        SALES_EMAIL +
        '. Fix one of these, then Approve again:\n' +
        '1) Open Gmail for the script owner → Settings → Accounts → Send mail as → add ' +
        SALES_EMAIL +
        '\n' +
        '2) Or move this Apps Script to the sales@ Google account and redeploy.\n' +
        'Detail: ' +
        String(err),
    )
  }
}

function normalizeLead_(data) {
  return {
    name: data.name || data.Name || '',
    organization: data.organization || data.Organization || '',
    email: String(data.email || data.Email || '').trim(),
    phone: data.phone || data.Phone || '',
    requirementType: data.requirementType || data['Requirement type'] || '',
    product: data.product || '',
    productSlug: data.productSlug || '',
  }
}

function makeToken_(email, productSlug) {
  var raw = String(email).toLowerCase() + '|' + String(productSlug) + '|' + APPROVE_SECRET
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)
  return Utilities.base64EncodeWebSafe(digest).replace(/=+$/, '')
}

function checkToken_(email, productSlug, token) {
  if (!token) return false
  return makeToken_(email, productSlug) === token
}

function esc_(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function htmlPage_(title, messageHtml, ok) {
  var color = ok ? '#166534' : '#b91c1c'
  var html =
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' +
    esc_(title) +
    '</title></head><body style="font-family:system-ui,sans-serif;padding:2rem;max-width:36rem;margin:auto;">' +
    '<h1 style="color:' +
    color +
    ';">' +
    esc_(title) +
    '</h1><p>' +
    messageHtml +
    '</p></body></html>'
  return HtmlService.createHtmlOutput(html).setTitle(title)
}
