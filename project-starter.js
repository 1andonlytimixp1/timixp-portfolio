(() => {
  const builder = document.querySelector('#project-starter');
  if (!builder) return;
  const form = builder.querySelector('form');
  const preview = builder.querySelector('.brief-preview');
  const idea = builder.querySelector('#brief-idea');
  const timing = builder.querySelector('#brief-timing');
  const content = {
    website: { name: 'Website', label: 'A HOME FOR YOUR IDEAS', lines: ['Your corner', 'of the internet.'], description: 'A website that feels like you. Built for the people you want to reach.' },
    app: { name: 'App', label: 'LESS FRICTION. MORE FLOW.', lines: ['A little smarter.', 'A lot more useful.'], description: 'Turn an everyday problem into a simpler experience. One thoughtful feature at a time.' },
    graphics: { name: 'Graphics', label: 'SOMETHING WORTH NOTICING', lines: ['Your idea.', 'Unmistakably you.'], description: 'A visual identity with something to say. From a first impression to the details that stick.' }
  };
  function update() {
    const selected = form.elements.project.value;
    const item = content[selected];
    if (preview.dataset.project !== selected) {
      preview.dataset.project = selected;
      builder.querySelector('#brief-preview-label').textContent = item.label;
      const heading = builder.querySelector('#brief-preview-title');
      heading.replaceChildren(document.createTextNode(item.lines[0]), document.createElement('br'), document.createTextNode(item.lines[1]));
      builder.querySelector('#brief-preview-description').textContent = item.description;
    }
    builder.querySelector('#brief-plan').textContent = item.name;
    builder.querySelector('#brief-pace').textContent = timing.value;
    builder.querySelector('#brief-count').textContent = idea.value.length + ' / 400';
    const message = [
      "Hi Timix P! I'd like to discuss a project.",
      'Project: ' + item.name,
      'Timing: ' + timing.value,
      idea.value.trim() ? 'My idea: ' + idea.value.trim() : "I'm still shaping the idea and would love to talk it through.",
      'Could we discuss the scope and a quote?'
    ].join('\n\n');
    builder.querySelector('#brief-send').href = 'https://wa.me/2347019833790?text=' + encodeURIComponent(message);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  update();
})();
