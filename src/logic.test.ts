import {describe,it,expect} from 'vitest';
import {generateTitle,TITLES,REAL_TITLES} from './logic';
describe('career debugger',()=>{
 it('handles zero selected skills',()=>expect(generateTitle([])).toContain('404'));
 it('recognizes a single specialty',()=>expect(generateTitle(['QA'])).toContain('QA Specialist'));
 it('combines QA and development',()=>expect(generateTitle(['QA','Development'])).toContain('Bug Creator'));
 it('produces different titles on repeated attempts',()=>expect(generateTitle(['QA','Product'],0)).not.toBe(generateTitle(['QA','Product'],1)));
 it('includes recognizable professional titles',()=>expect(REAL_TITLES).toContain('Technical Product Manager'));
 it('always has titles for Lital',()=>expect(TITLES.length).toBeGreaterThan(3));
});
