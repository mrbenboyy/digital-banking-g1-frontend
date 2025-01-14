import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountsComponent } from './my-accounts.component';

describe('MyAccountsComponent', () => {
  let component: MyAccountsComponent;
  let fixture: ComponentFixture<MyAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
