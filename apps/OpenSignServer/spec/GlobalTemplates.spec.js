import globalTemplateLibrary from '../data/globalTemplates.cjs';
import globalTemplateMigration from '../databases/migrations/20260821010000-add_global_template_library.cjs';

describe('global template library', () => {
  const { PAGE_HEIGHT, PAGE_WIDTH, templates } = globalTemplateLibrary;

  it('ships a useful starter library with stable unique slugs', () => {
    expect(templates.length).toBeGreaterThanOrEqual(6);
    expect(new Set(templates.map(template => template.slug)).size).toBe(templates.length);
    expect(templates.map(template => template.slug)).toContain('mutual-nondisclosure-agreement');
    expect(templates.map(template => template.slug)).toContain('employment-offer-letter');
  });

  it('keeps every fillable field and signer widget inside the letter page', () => {
    for (const template of templates) {
      const widgets = [...template.fields, ...template.roles.flatMap(role => role.widgets)];

      for (const widget of widgets) {
        expect(widget.x).toBeGreaterThanOrEqual(0);
        expect(widget.y).toBeGreaterThanOrEqual(0);
        expect(widget.x + widget.width).toBeLessThanOrEqual(PAGE_WIDTH);
        expect(widget.y + widget.height).toBeLessThanOrEqual(PAGE_HEIGHT);
      }
    }
  });

  it('creates a prefill role and two required signer roles per template', () => {
    for (const template of templates) {
      const placeholders = globalTemplateMigration.placeholdersFor(template);
      expect(placeholders[0].Role).toBe('prefill');
      expect(placeholders.slice(1).length).toBe(2);
      expect(
        placeholders
          .slice(1)
          .every(role => role.placeHolder[0].pos.some(widget => widget.type === 'signature'))
      ).toBeTrue();
    }
  });
});
