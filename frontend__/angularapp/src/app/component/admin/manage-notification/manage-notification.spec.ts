import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNotification } from './manage-notification';

describe('ManageNotification', () => {
  let component: ManageNotification;
  let fixture: ComponentFixture<ManageNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
