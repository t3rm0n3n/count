'use babel';

import CountView from './count-view';
import { CompositeDisposable } from 'atom';

export default {

  countView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.countView = new CountView(state.countViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.countView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'count:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.countView.destroy();
  },

  serialize() {
    return {
      countViewState: this.countView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const words = editor.getLineCount();
      this.countView.setCount(words);
      this.modalPanel.show();
    }
  }

};
