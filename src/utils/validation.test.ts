import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStatusPercentage,
  formatLeadDate,
  isValidEmail,
  isValidPhone,
  validateLeadInput,
} from './validation.ts';

test('isValidEmail accepts standard emails and rejects invalid formats', () => {
  assert.equal(isValidEmail('priya@meridiancloud.io'), true);
  assert.equal(isValidEmail('first.last+tag@sub.company.co.uk'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('missing@domain'), false);
  assert.equal(isValidEmail(''), false);
});

test('isValidPhone accepts international/formatted phones and rejects invalid strings', () => {
  assert.equal(isValidPhone('+1 (415) 890-2314'), true);
  assert.equal(isValidPhone('555-234-5678'), true);
  assert.equal(isValidPhone('+44 20 7946 0821'), true);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone('abc-def-ghij'), false);
  assert.equal(isValidPhone(''), false);
});

test('validateLeadInput returns field errors for empty or invalid input', () => {
  const result = validateLeadInput({
    name: ' ',
    email: 'invalid-email',
    phone: '12',
    company: '',
    source: 'UnknownSource',
    status: 'InvalidStatus',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.company);
  assert.ok(result.errors.source);
  assert.ok(result.errors.status);
});

test('validateLeadInput sanitizes valid input and normalizes email case', () => {
  const result = validateLeadInput({
    name: '  Elena Vance  ',
    email: '  Elena.Vance@VanceLabs.IO  ',
    phone: ' +1 (415) 555-0194 ',
    company: '  Vance Labs  ',
    source: 'Referral',
    status: 'Qualified',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.sanitized, {
    name: 'Elena Vance',
    email: 'elena.vance@vancelabs.io',
    phone: '+1 (415) 555-0194',
    company: 'Vance Labs',
    source: 'Referral',
    status: 'Qualified',
  });
});

test('calculateStatusPercentage handles zero total safely', () => {
  assert.equal(calculateStatusPercentage(0, 0), 0);
  assert.equal(calculateStatusPercentage(3, 10), 30);
  assert.equal(calculateStatusPercentage(2, 3), 67);
});

test('formatLeadDate formats SQLite UTC timestamps cleanly', () => {
  const formatted = formatLeadDate('2026-11-22 14:30:00');
  assert.match(formatted, /Nov 22, 2026/);
  assert.equal(formatLeadDate(''), '—');
});
