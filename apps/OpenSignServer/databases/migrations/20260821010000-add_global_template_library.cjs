const { templates } = require('../../data/globalTemplates.cjs');

const widget = (definition, index) => ({
  xPosition: definition.x,
  yPosition: definition.y,
  key: `global-widget-${index + 1}`,
  scale: 1,
  zIndex: index + 1,
  type: definition.type || 'text input',
  ...(definition.type === 'signature' ? { signatureType: '' } : {}),
  options: {
    name: definition.name,
    status: 'required',
    response: '',
    ...(definition.type === 'text input' ? { isReadOnly: false } : {}),
    ...(definition.type === 'date'
      ? { isReadOnly: false, validation: { format: 'MM/dd/yyyy', type: 'date-format' } }
      : {}),
  },
  Width: definition.width,
  Height: definition.height,
});

const placeholdersFor = template => {
  const prefill = {
    Id: `global-${template.slug}-prefill`,
    Role: 'prefill',
    Name: 'Complete agreement details',
    blockColor: 'transparent',
    signerObjId: '',
    signerPtr: {},
    placeHolder: [
      {
        pageNumber: 1,
        pos: template.fields.map((definition, index) => widget(definition, index)),
      },
    ],
  };

  const signerRoles = template.roles.map((signer, roleIndex) => ({
    Id: `${signer.id}-${template.slug}`,
    Role: signer.name,
    blockColor: signer.color,
    signerObjId: '',
    signerPtr: {},
    email: '',
    placeHolder: [
      {
        pageNumber: 1,
        pos: signer.widgets.map((definition, index) =>
          widget(definition, template.fields.length + roleIndex * 10 + index)
        ),
      },
    ],
  }));

  return [prefill, ...signerRoles];
};

exports.placeholdersFor = placeholdersFor;

exports.up = async Parse => {
  const schema = new Parse.Schema('contracts_Template');
  schema.addBoolean('IsGlobal', false);
  schema.addString('GlobalTemplateSlug');
  schema.addString('Category');
  schema.addIndex('global_template_slug_1', { GlobalTemplateSlug: 1 });
  await schema.update(null, { useMasterKey: true });

  const publicUrl = (process.env.PUBLIC_URL || 'https://legal.samsprojects.xyz').replace(/\/$/, '');
  for (const definition of templates) {
    const query = new Parse.Query('contracts_Template');
    query.equalTo('GlobalTemplateSlug', definition.slug);
    let template = await query.first({ useMasterKey: true });
    if (!template) template = new Parse.Object('contracts_Template');

    template.set('Name', definition.name);
    template.set('Description', definition.description);
    template.set('Category', definition.category);
    template.set('GlobalTemplateSlug', definition.slug);
    template.set('IsGlobal', true);
    template.set('IsArchive', false);
    template.set('Type', 'Template');
    template.set('URL', `${publicUrl}/templates/${definition.slug}.pdf`);
    template.set('Placeholders', placeholdersFor(definition));
    template.set('TimeToCompleteDays', 15);
    template.set('AutomaticReminders', false);
    template.set('SendinOrder', false);
    template.set('NotifyOnSignatures', false);
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    template.setACL(acl);
    await template.save(null, { useMasterKey: true });
  }
};

exports.down = async Parse => {
  const query = new Parse.Query('contracts_Template');
  query.equalTo('IsGlobal', true);
  query.limit(1000);
  const globalTemplates = await query.find({ useMasterKey: true });
  await Parse.Object.destroyAll(globalTemplates, { useMasterKey: true });

  const schema = new Parse.Schema('contracts_Template');
  schema.deleteField('IsGlobal');
  schema.deleteField('GlobalTemplateSlug');
  schema.deleteField('Category');
  await schema.update(null, { useMasterKey: true });
};
