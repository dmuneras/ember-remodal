import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

const {
  RSVP: { Promise },
  run
} = Ember;

moduleForComponent('ember-remodal', 'Unit | Component | ember remodal', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

const ModalMock = Ember.Object.extend({
  openCalled: false,
  closeCalled: false,

  open() {
    this.set('openCalled', true);
  },

  close() {
    this.set('closeCalled', true);
  }
});

test('it renders', function(assert) {
  assert.expect(1);

  run(() => {
    this.subject();
    this.render();
    assert.equal(this.$().text().trim(), '');
  });
});

test('"open()" returns a promise', function(assert) {
  assert.expect(1);

  run(() => {
    const component = this.subject({ disableAnimation: true });
    this.render();
    assert.ok(component.open() instanceof Promise);
  });
});

test('"close()" returns a promise', function(assert) {
  assert.expect(1);

  return run(() => {
    const component = this.subject({ disableAnimation: true });
    this.render();

    return component.open().then((modal) => {
      assert.ok(modal.close() instanceof Promise);
    });
  });
});

test('if "modal" exists, "open" action calls "open()" on "modal"', function(assert) {
  assert.expect(1);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });

    this.render();

    component.send('open');
    assert.ok(component.get('modal.openCalled'));
  });
});

test('if "modal" does not exist, "open" action calls "_createInstanceAndOpen"', function(assert) {
  assert.expect(1);

  run(() => {
    const component = this.subject({
      methodCalled: false,

      _createInstanceAndOpen() {
        this.set('methodCalled', true);
      }
    });

    this.render();

    run(() => component.send('open'));
    run(() => assert.ok(component.get('methodCalled')));
  });
});

test('if "modal" does not exist, "open" action calls "_createInstanceAndOpen"', function(assert) {
  assert.expect(1);

  run(() => {
    const component = this.subject({
      methodCalled: false,

      _createInstanceAndOpen() {
        this.set('methodCalled', true);
      }
    });

    this.render();

    run(() => component.send('open'));
    run(() => assert.ok(component.get('methodCalled')));
  });
});

test('"confirm" action sends "onConfirm" action', function(assert) {
  assert.expect(2);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });
    component.set('onConfirmCalled', false);

    component.set('onConfirm', () => {
      component.set('onConfirmCalled', true);
    });

    this.render();

    assert.notOk(component.get('onConfirmCalled'));
    component.send('confirm');
    assert.ok(component.get('onConfirmCalled'));
  });
});

test('"confirm" action sends "close" action', function(assert) {
  assert.expect(2);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });

    this.render();

    assert.notOk(component.get('modal.closeCalled'));
    component.send('confirm');
    assert.ok(component.get('modal.closeCalled'));
  });
});

test('"confirm" action does not send "close" action when "closeOnConfirm" is false', function(assert) {
  assert.expect(2);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });
    component.set('closeOnConfirm', false);

    this.render();

    assert.notOk(component.get('modal.closeCalled'));
    component.send('confirm');
    assert.notOk(component.get('modal.closeCalled'));
  });
});

test('"cancel" action sends "close" action', function(assert) {
  assert.expect(2);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });

    this.render();

    assert.notOk(component.get('modal.closeCalled'));
    component.send('cancel');
    assert.ok(component.get('modal.closeCalled'));
  });
});

test('"cancel" action does not send "close" action when "closeOnCancel" is false', function(assert) {
  assert.expect(2);

  run(() => {
    const component = this.subject({ modal: ModalMock.create() });
    component.set('closeOnCancel', false);

    this.render();

    assert.notOk(component.get('modal.closeCalled'));
    component.send('cancel');
    assert.notOk(component.get('modal.closeCalled'));
  });
});