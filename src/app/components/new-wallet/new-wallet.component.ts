import { Component, OnInit, Input, Query } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { MessageService } from '../../services/message.service';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.scss']
})
export class NewWalletComponent implements OnInit {
  @Input() pwd1 = '';
  @Input() pwd2 = '';
  activePanel = 0;
  data = {
    type: '',
    sk: '',
    pkh: '',
    salt: ''
  };
  mnemonic: string;
  constructor(private walletService: WalletService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.generateSeed();
    }, 1);
  }
  generateSeed() {
    this.mnemonic = this.walletService.createNewWallet();
    this.activePanel++;
  }
  pwdView() {
    this.activePanel++;
  }
  encryptWallet() {
    if (this.validatePwd()) {
      this.data = this.walletService.createEncryptedWallet(this.mnemonic, this.pwd1);
      this.mnemonic = '';
      this.pwd1 = '';
      this.pwd2 = '';
      this.activePanel++;
      this.walletService.storeWallet();
    }
  }
  validatePwd(): boolean {
    if (this.pwd1 === '') {
      this.messageService.add('Passsword must be set!');
    } else if (this.pwd1 !== this.pwd2) {
      this.messageService.add('Passswords doesn\'t match!');
    } else {
      return true;
    }
    return false;
  }
  reset() {
    this.activePanel = 0;
  }
  export(): string {
    return JSON.stringify(this.data);
  }
}