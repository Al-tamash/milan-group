import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type Contact = { name: string; phones: string[] };
type Social = { key: string; label: string; url: string };
const site = JSON.parse(readFileSync("src/data/site.json", "utf8")) as {
  hours: string;
  emergency: string;
  tour360: string;
  contacts: Contact[];
  socials: Social[];
};

test("hours are daily 8 am – 10 pm, with 24 hours only for emergencies", () => {
  assert.equal(site.hours, "Open daily, 8 am – 10 pm");
  assert.equal(site.emergency, "Emergency service 24 hours");
  assert.ok(!JSON.stringify(site).includes("Open 24 hours"));
});

test("the founder is not listed as a contact", () => {
  assert.ok(!site.contacts.some((c) => /amjad/i.test(c.name)));
  assert.equal(site.contacts[0].name, "Milan Group");
  assert.equal(site.contacts[0].phones[0], "9441361086");
});

test("socials are the five verified accounts", () => {
  assert.deepEqual(
    site.socials.map((s) => s.url),
    [
      "https://www.instagram.com/milan_s_co_group/",
      "https://www.facebook.com/milansupplyingcompany1218",
      "https://www.youtube.com/@Milanscogroup",
      "https://x.com/CoSupplying",
      "https://whatsapp.com/channel/0029Va6JZStL2ATy7zUn2r14",
    ],
  );
  assert.equal(site.socials[4].label, "WhatsApp Channel");
});

test("tour360 is empty until the customer sends it", () => {
  assert.equal(site.tour360, "");
});
