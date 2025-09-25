import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBoard } from './manage-board';

describe('ManageBoard', () => {
  let component: ManageBoard;
  let fixture: ComponentFixture<ManageBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
